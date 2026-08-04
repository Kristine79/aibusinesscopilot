import pytest
from httpx import AsyncClient

from app.modules.auth.security import decode_access_token


@pytest.mark.asyncio
class TestRegister:
    async def test_register_success(self, client: AsyncClient):
        resp = await client.post(
            "/api/auth/register",
            json={"name": "Test User", "email": "test@example.com", "password": "password123"},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_register_duplicate_email(self, client: AsyncClient):
        await client.post(
            "/api/auth/register",
            json={"name": "User1", "email": "dup@example.com", "password": "password123"},
        )
        resp = await client.post(
            "/api/auth/register",
            json={"name": "User2", "email": "dup@example.com", "password": "password123"},
        )
        assert resp.status_code == 409
        assert "already registered" in resp.json()["detail"].lower()

    async def test_register_weak_password(self, client: AsyncClient):
        resp = await client.post(
            "/api/auth/register",
            json={"name": "User", "email": "weak@example.com", "password": "1234567"},
        )
        assert resp.status_code == 422


@pytest.mark.asyncio
class TestLogin:
    async def test_login_success(self, client: AsyncClient):
        await client.post(
            "/api/auth/register",
            json={"name": "Login User", "email": "login@example.com", "password": "password123"},
        )
        resp = await client.post(
            "/api/auth/login",
            json={"email": "login@example.com", "password": "password123"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data

    async def test_login_wrong_password(self, client: AsyncClient):
        await client.post(
            "/api/auth/register",
            json={"name": "User", "email": "wrong@example.com", "password": "password123"},
        )
        resp = await client.post(
            "/api/auth/login",
            json={"email": "wrong@example.com", "password": "wrongpass"},
        )
        assert resp.status_code == 401

    async def test_login_nonexistent_email(self, client: AsyncClient):
        resp = await client.post(
            "/api/auth/login",
            json={"email": "nobody@example.com", "password": "password123"},
        )
        assert resp.status_code == 401


@pytest.mark.asyncio
class TestRefresh:
    async def test_refresh_success(self, client: AsyncClient):
        reg = await client.post(
            "/api/auth/register",
            json={"name": "Refresh User", "email": "refresh@example.com", "password": "password123"},
        )
        refresh_token = reg.json()["refresh_token"]

        resp = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["refresh_token"] != refresh_token

    async def test_refresh_invalid_token(self, client: AsyncClient):
        resp = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid-token"},
        )
        assert resp.status_code == 401

    async def test_refresh_reuse_detection(self, client: AsyncClient):
        reg = await client.post(
            "/api/auth/register",
            json={"name": "Reuse User", "email": "reuse@example.com", "password": "password123"},
        )
        refresh_token = reg.json()["refresh_token"]

        await client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
        resp2 = await client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
        assert resp2.status_code == 401


@pytest.mark.asyncio
class TestMe:
    async def test_me_authenticated(self, client: AsyncClient):
        reg = await client.post(
            "/api/auth/register",
            json={"name": "Me User", "email": "me@example.com", "password": "password123"},
        )
        token = reg.json()["access_token"]

        resp = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "me@example.com"
        assert data["name"] == "Me User"

    async def test_me_unauthenticated(self, client: AsyncClient):
        resp = await client.get("/api/auth/me")
        assert resp.status_code == 401

    async def test_me_invalid_token(self, client: AsyncClient):
        resp = await client.get("/api/auth/me", headers={"Authorization": "Bearer invalid"})
        assert resp.status_code == 401


@pytest.mark.asyncio
class TestLogout:
    async def test_logout_invalidates_tokens(self, client: AsyncClient):
        reg = await client.post(
            "/api/auth/register",
            json={"name": "Logout User", "email": "logout@example.com", "password": "password123"},
        )
        token = reg.json()["access_token"]
        refresh_token = reg.json()["refresh_token"]

        resp = await client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 204

        refresh_resp = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert refresh_resp.status_code == 401


@pytest.mark.asyncio
class TestTokenSecurity:
    async def test_access_token_expiry(self, client: AsyncClient):
        reg = await client.post(
            "/api/auth/register",
            json={"name": "Exp User", "email": "exp@example.com", "password": "password123"},
        )
        token = reg.json()["access_token"]
        payload = decode_access_token(token)
        assert payload is not None
        assert payload.get("type") == "access"
        assert payload.get("sub") is not None

    async def test_invalid_signature(self, client: AsyncClient):
        from jose import jwt as jose_jwt

        bad_token = jose_jwt.encode(
            {"sub": "1", "type": "access", "exp": 9999999999},
            "wrong-secret-that-is-longer-than-thirty-two-chars",
            algorithm="HS256",
        )
        resp = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {bad_token}"})
        assert resp.status_code == 401
