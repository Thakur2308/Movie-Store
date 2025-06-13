from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.boxoffice import router as auth_router
from routes.movie import router as movie_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(movie_router)