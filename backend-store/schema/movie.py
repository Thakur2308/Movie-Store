from pydantic import BaseModel

class MovieSchema(BaseModel):
    mov_id: int
    mov_name: str
    release_month: str
    release_year: int
    mov_genre: str

class HelpQuestion(BaseModel):
    question: str

class HelpSolution(BaseModel):
    question_id: str
    solution: str