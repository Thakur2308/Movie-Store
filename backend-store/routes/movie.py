from fastapi import APIRouter, HTTPException, Depends
from config.db import db
from schema.movie import MovieSchema, HelpQuestion, HelpSolution
from models.movie import movie_helper
from bson import ObjectId
from auth import get_current_user

router = APIRouter()

def get_user_collection(username: str):
    return db[f"movies_{username}"]

@router.post("/movies")
def create_movie(movie: MovieSchema, username: str = Depends(get_current_user)):
    user_collection = get_user_collection(username)

    if user_collection.find_one({"mov_id": movie.mov_id}):
        raise HTTPException(status_code=400, detail="Movie with this ID already exists")

    movie_data = movie.dict()
    user_collection.insert_one(movie_data)
    return {"message": "Movie created successfully"}

@router.get("/movies/user")
def get_user_movies(username: str = Depends(get_current_user)):
    user_collection = get_user_collection(username)
    try:
        movies = list(user_collection.find())
        return [movie_helper(movie) for movie in movies]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user movies: {str(e)}")

@router.delete("/movies/user/{mov_id}")
def delete_user_movie(mov_id: int, username: str = Depends(get_current_user)):
    user_collection = get_user_collection(username)
    result = user_collection.delete_one({"mov_id": mov_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Movie not found")
    return {"message": "Movie deleted successfully"}

@router.put("/movies/user/{mov_id}")
def update_user_movie(
    mov_id: int,
    updated_movie: MovieSchema, 
    username: str = Depends(get_current_user)
):
    user_collection = get_user_collection(username)
    existing_movie = user_collection.find_one({"mov_id": mov_id})
    if not existing_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    update_result = user_collection.update_one(
        {"mov_id": mov_id},
        {"$set": updated_movie.dict()}
    )
    
    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes made")
    
    return {"message": "Movie updated successfully"}

@router.post("/help")
def post_question(question: HelpQuestion):
    q_id = db.help.insert_one({"question": question.question})
    return {"message": "Question submitted", "id": str(q_id.inserted_id)}

@router.get("/help/questions")
def get_unanswered_questions():
    questions = list(db.help.find({"solution": {"$exists": False}}))
    for q in questions:
        q["_id"] = str(q["_id"])
    return questions

@router.get("/help/all")
def get_all_questions():
    questions = list(db.help.find())
    for q in questions:
        q["_id"] = str(q["_id"])
    return questions

@router.post("/help/answer")
def post_solution(sol: HelpSolution, username: str = Depends(get_current_user)):
    result = db.help.update_one(
        {"_id": ObjectId(sol.question_id)},
        {"$set": {"solution": sol.solution, "replied_by": username}},
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Question not found or already answered")
    return {"message": "Reply submitted successfully"}
