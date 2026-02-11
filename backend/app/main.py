from fastapi import FastAPI
from backend.app.auth.routes import router as auth_router
from backend.app.books.routes import router as books_router
from backend.app.users.routes import router as users_router
from backend.app.search.routes import router as search_router

app = FastAPI(title='Programming Books Recommendation System')

app.include_router(auth_router, prefix='/auth', tags=['auth'])
app.include_router(books_router, prefix='/books', tags='books')
app.include_router(users_router, prefix='users', tags=['users'])
app.include_router(search_router)
