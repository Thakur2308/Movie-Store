import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReleaseMovie from './ReleaseMovie';
import { Link } from 'react-router-dom';

const Dashboard = ({ username }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const takeMovies = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from storage
      const result = await axios.get(
        `http://localhost:8000/movies/user`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMovies(result.data);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      alert("Error fetching movies.");
    }
  };

  const deleteMovie = async (mov_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8000/movies/user/${mov_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMovies(movies.filter(mov => mov.mov_id !== mov_id));
      alert("Movie Deleted Successfully");
    } catch (err) {
      console.error("Failed to delete movie", err);
      alert("Error deleting movie.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    navigate('/');
  };

  useEffect(() => {
    takeMovies();
  }, []);

  return (
    <div className="container">
      <div className="dashboard-container">
        <h2>Welcome, {username}!</h2>
        <ReleaseMovie username={username} onMovieAdded={takeMovies} />

        <h3>Movie List</h3>
        {movies.length > 0 ? (
          <table className="movie-table">
            <thead>
              <tr>
                <th>Movie ID</th>
                <th>Movie</th>
                <th>Release Month</th>
                <th>Release Year</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((mov) => (
                <tr key={mov.mov_id}>
                  <td>{mov.mov_id}</td>
                  <td>{mov.mov_name}</td>
                  <td>{mov.release_month}</td>
                  <td>{mov.release_year}</td>
                  <td>{mov.mov_genre}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteMovie(mov.mov_id)}>
                      Delete
                    </button>
                    <button 
                      className="edit-btn" 
                      onClick={() => navigate(`/edit/${mov.mov_id}`, { state: { movie: mov, username: username } })}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-movie-text">No movies released yet.</p>
        )}
        
        <Link to="/prodhelp" className="help-button">Answer Questions</Link><br />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;