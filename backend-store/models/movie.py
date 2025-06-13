def movie_helper(movie) -> dict:
    return {
        "id": str(movie.get("_id", "")),
        "mov_id": movie.get("mov_id", None),
        "mov_name": movie.get("mov_name", ""),
        "release_month": movie.get("release_month", ""),
        "release_year": movie.get("release_year", None),
        "mov_genre": movie.get("mov_genre", ""),
        "director": movie.get("director", "")
    }
