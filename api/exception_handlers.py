from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from exceptions.categories import CategoryAlreadyExists
from exceptions.expenses import CategoryDoesNotExist
from exceptions.users import EmailAlreadyExists, UserNotFoundError, InvalidCredentials



def _error(detail: str, status_code: int) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"detail": detail})


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(EmailAlreadyExists)
    async def handle_email_already_exists(
        request: Request, exc: EmailAlreadyExists
    ) -> JSONResponse:
        return _error(str(exc), status.HTTP_409_CONFLICT)

    @app.exception_handler(UserNotFoundError)
    async def handle_user_not_found(
        request: Request, exc: UserNotFoundError
    ) -> JSONResponse:
        return _error(str(exc), status.HTTP_404_NOT_FOUND)

    @app.exception_handler(CategoryAlreadyExists)
    async def handle_category_already_exists(
        request: Request, exc: CategoryAlreadyExists
    ) -> JSONResponse:
        return _error(str(exc), status.HTTP_409_CONFLICT)

    @app.exception_handler(CategoryDoesNotExist)
    async def handle_category_does_not_exist(
        request: Request, exc: CategoryDoesNotExist
    ) -> JSONResponse:
        return _error(str(exc), status.HTTP_404_NOT_FOUND)

    @app.exception_handler(ValueError)
    async def handle_value_error(request: Request, exc: ValueError) -> JSONResponse:
        return _error(str(exc), status.HTTP_400_BAD_REQUEST)
    
    @app.exception_handler(InvalidCredentials)
    async def handle_invalid_credentials(request: Request, exc: InvalidCredentials):
        return _error(str(exc), status.HTTP_400_BAD_REQUEST)
    