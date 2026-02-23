from backend.app.core.security import logout as security_logout, get_client_ip
from fastapi.security import OAuth2PasswordRequestForm
from backend.app.enum.enumerations import Enumerations
from backend.app.core.rate_limit import RateLimiter
from fastapi import APIRouter, Depends, Request
from .schemas import RefreshTokenRequest
from .service import AuthService

router = APIRouter()
limiter = RateLimiter(
    limit=Enumerations.limit,
    window_seconds=Enumerations.window_seconds
)


@router.post("/login")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    await limiter(request)

    return await AuthService.authenticate_user(
        username=form_data.username,
        password=form_data.password,
        ip=get_client_ip(request),
        ua=request.headers.get("user-agent")
    )


@router.post("/refresh")
async def refresh_tokens(
    request: Request,
    refresh_req: RefreshTokenRequest
):
    await limiter(request)

    return await AuthService.refresh_user_tokens(
        token=refresh_req.refresh_token,
        ip=get_client_ip(request),
        ua=request.headers.get("user-agent")
    )


@router.post("/logout")
async def logout(
    logout_msg: dict = Depends(security_logout)
):
    return logout_msg
