from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.core.logging import get_logger
from .models import UserCreate, UserResponse, UserInterestsUpdate, User
from .service import UserService
from backend.app.core.security import get_current_user

router = APIRouter
logger = get_logger(__name__, system_type="backend")


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(user_in: UserCreate):
    try:
        user = await UserService.create_user(user_in)
        logger.info(f"New user registered: {user.email}")
        return user

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me/interests", response_model=UserResponse)
async def update_interests(
    payload: UserInterestsUpdate,
    current_user: User = Depends(get_current_user)
):
    try:
        updated = await UserService.update_interests(
            current_user.id,
            payload.interests
        )
        logger.info(f"Updated interests for user: {current_user.email}")
        return updated

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    except Exception as e:
        logger.error(f"Error updating interests: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
