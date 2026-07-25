import pytest
import pytest_asyncio
from httpx import AsyncClient


@pytest_asyncio.fixture
async def auth_client(client: AsyncClient) -> AsyncClient:
    await client.post(
        "/api/auth/register",
        json={"name": "Workspace Owner", "email": "ws@example.com", "password": "password123"},
    )
    resp = await client.post(
        "/api/auth/login",
        json={"email": "ws@example.com", "password": "password123"},
    )
    token = resp.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest.mark.asyncio
class TestWorkspaceCRUD:
    async def test_create_workspace(self, auth_client: AsyncClient):
        resp = await auth_client.post("/api/workspaces", json={"name": "My Company"})
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "My Company"
        assert data["member_count"] == 1

    async def test_list_workspaces(self, auth_client: AsyncClient):
        await auth_client.post("/api/workspaces", json={"name": "WS1"})
        await auth_client.post("/api/workspaces", json={"name": "WS2"})
        resp = await auth_client.get("/api/workspaces")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 2

    async def test_get_workspace(self, auth_client: AsyncClient):
        create = await auth_client.post("/api/workspaces", json={"name": "Get Test"})
        ws_id = create.json()["id"]
        resp = await auth_client.get(f"/api/workspaces/{ws_id}")
        assert resp.status_code == 200
        assert resp.json()["name"] == "Get Test"

    async def test_get_nonexistent_workspace(self, auth_client: AsyncClient):
        resp = await auth_client.get("/api/workspaces/99999")
        assert resp.status_code == 404

    async def test_auto_workspace_on_register(self, client: AsyncClient):
        reg = await client.post(
            "/api/auth/register",
            json={"name": "Auto WS", "email": "autows@example.com", "password": "password123"},
        )
        token = reg.json()["access_token"]
        resp = await client.get("/api/workspaces", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 1
        assert data[0]["name"] == "Auto WS's Workspace"


@pytest.mark.asyncio
class TestWorkspaceMembers:
    async def test_add_member(self, auth_client: AsyncClient, client: AsyncClient):
        create = await auth_client.post("/api/workspaces", json={"name": "Team WS"})
        ws_id = create.json()["id"]

        member_reg = await client.post(
            "/api/auth/register",
            json={"name": "Member", "email": "member2@example.com", "password": "password123"},
        )
        member_token = member_reg.json()["access_token"]
        me_resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {member_token}"},
        )
        member_id = me_resp.json()["id"]

        resp = await auth_client.post(
            f"/api/workspaces/{ws_id}/members",
            json={"user_id": member_id, "role": "member"},
        )
        assert resp.status_code == 204

    async def test_non_admin_cannot_add_member(
        self, auth_client: AsyncClient, client: AsyncClient
    ):
        create = await auth_client.post("/api/workspaces", json={"name": "Restricted"})
        ws_id = create.json()["id"]

        member_reg = await client.post(
            "/api/auth/register",
            json={"name": "Victim", "email": "victim@example.com", "password": "password123"},
        )
        member_token = member_reg.json()["access_token"]
        me_resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {member_token}"},
        )
        member_id = me_resp.json()["id"]

        other_client = AsyncClient(
            transport=client._transport,
            base_url=client.base_url,
            headers={"Authorization": f"Bearer {member_token}"},
        )
        resp = await other_client.post(
            f"/api/workspaces/{ws_id}/members",
            json={"user_id": member_id, "role": "member"},
        )
        assert resp.status_code == 403

    async def test_list_members(self, auth_client: AsyncClient):
        create = await auth_client.post("/api/workspaces", json={"name": "Member List"})
        ws_id = create.json()["id"]

        resp = await auth_client.get(f"/api/workspaces/{ws_id}/members")
        assert resp.status_code == 200
        members = resp.json()
        assert len(members) == 1
        assert members[0]["role"] == "admin"
