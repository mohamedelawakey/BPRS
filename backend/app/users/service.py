from backend.app.db.postgres import PostgresDBConnection
from backend.app.enum.enumerations import Enumerations
from .models import User, UserCreate, UserResponse
from backend.app.core.hashing import hash_password
from backend.app.core.logging import get_logger
from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4

logger = get_logger(__name__)


class UserService:
    @staticmethod
    async def get_by_email(email: str) -> Optional[User]:
        query = Enumerations.get_by_email_query
        async with PostgresDBConnection.get_db_connection() as conn:
            result = await conn.fetchrow(query, email)

            if result:
                return User(**dict(result))

        return None

    @staticmethod
    async def get_by_id(user_id: str) -> Optional[User]:
        query = Enumerations.get_by_id_query
        async with PostgresDBConnection.get_db_connection() as conn:
            result = await conn.fetchrow(query, user_id)

            if result:
                return User(**dict(result))

        return None

    @staticmethod
    async def create_user(user_in: UserCreate) -> UserResponse:
        existing_user = await UserService.get_by_email(user_in.email)

        if existing_user:
            raise ValueError("User with this email already exists")

        new_id = str(uuid4())
        hashed_pw = hash_password(user_in.password)
        created_at = datetime.now(timezone.utc)
        role = Enumerations.Role.user
        is_active = True

        query = Enumerations.create_user_query

        async with PostgresDBConnection.get_db_connection() as conn:
            result = await conn.fetchrow(
                query,
                new_id,
                user_in.email,
                user_in.full_name,
                role,
                is_active,
                hashed_pw,
                created_at,
                []
            )

            return UserResponse(
                id=result['id'],
                email=result['email'],
                full_name=result['full_name'],
                role=result['role'],
                is_active=result['is_active'],
                created_at=result['created_at'],
                interests=list(result['interests']) if result['interests'] else []
            )

    @staticmethod
    async def update_interests(
        user_id: str,
        interests: List[str]
    ) -> UserResponse:
        query = Enumerations.update_interests_query

        async with PostgresDBConnection.get_db_connection() as conn:
            result = await conn.fetchrow(query, interests, user_id)

            if not result:
                raise ValueError("User not found")

            return UserResponse(
                id=result['id'],
                email=result['email'],
                full_name=result['full_name'],
                role=result['role'],
                is_active=result['is_active'],
                created_at=result['created_at'],
                interests=list(result['interests']) if result['interests'] else []
            )
