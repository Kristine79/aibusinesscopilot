from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, UnauthorizedError
from app.database.session import get_db
from app.modules.auth.repository import RefreshTokenRepository, UserRepository
from app.modules.workspace.repository import WorkspaceRepository
from app.modules.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserRead,
)
from app.modules.auth.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    hash_password,
    verify_password,
)

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> UserRead:
    if credentials is None:
        raise UnauthorizedError()

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise UnauthorizedError("Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedError("Invalid token payload")

    repo = UserRepository(db)
    user = await repo.get_by_id(int(user_id))
    if not user:
        raise UnauthorizedError("User not found")

    return UserRead.model_validate(user)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.token_repo = RefreshTokenRepository(db)

    async def register(self, data: RegisterRequest) -> TokenResponse:
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictError("Email already registered")

        user = await self.user_repo.create(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
        )

        ws_repo = WorkspaceRepository(self.db)
        ws = await ws_repo.create(f"{user.name}'s Workspace")
        await ws_repo.add_member(ws.id, user.id, "admin")

        access_token = create_access_token({"sub": str(user.id)})
        raw_token, token_hash, expires_at = create_refresh_token()

        await self.token_repo.create(user.id, token_hash, expires_at)
        await self.db.commit()

        return TokenResponse(
            access_token=access_token, refresh_token=raw_token
        )

    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise UnauthorizedError("Invalid email or password")

        access_token = create_access_token({"sub": str(user.id)})
        raw_token, token_hash, expires_at = create_refresh_token()

        await self.token_repo.create(user.id, token_hash, expires_at)
        await self.db.commit()

        return TokenResponse(
            access_token=access_token, refresh_token=raw_token
        )

    async def refresh(self, refresh_token: str) -> TokenResponse:
        import hashlib

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        stored = await self.token_repo.find_by_hash(token_hash)
        if not stored:
            raise UnauthorizedError("Invalid or expired refresh token")

        await self.db.delete(stored)
        await self.db.flush()

        access_token = create_access_token({"sub": str(stored.user_id)})
        raw_token, new_hash, expires_at = create_refresh_token()

        await self.token_repo.create(stored.user_id, new_hash, expires_at)
        await self.db.commit()

        return TokenResponse(
            access_token=access_token, refresh_token=raw_token
        )

    async def logout(self, user_id: int) -> None:
        await self.token_repo.delete_all_for_user(user_id)
        await self.db.commit()

    async def get_profile(self, user_id: int) -> UserRead:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise UnauthorizedError("User not found")
        return UserRead.model_validate(user)
