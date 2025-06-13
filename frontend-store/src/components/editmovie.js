import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.css'; // Make sure you have this import

const EditMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, username } = location.state;

  const [form, setForm] = useState({
    mov_id: movie.mov_id,
    mov_name: movie.mov_name,
    release_month: movie.release_month,
    release_year: movie.release_year,
    mov_genre: movie.mov_genre
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:8000/movies/user/${form.mov_id}`,
        form,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert("Movie updated successfully!");
        navigate('/dashboard', { state: { username } });
      } else {
        throw new Error(response.data?.message || 'Failed to update movie');
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || 
               err.response?.data?.message || 
               err.message || 
               'Error updating movie');
    }
  };

  return (
    <div className="container">
      <div className="edit-container">
        <h2>Edit Movie</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            name="mov_id" 
            value={form.mov_id} 
            readOnly 
            className="form-input"
          />
          <input 
            name="mov_name" 
            value={form.mov_name} 
            onChange={handleChange} 
            placeholder='Movie Name' 
            required 
            className="form-input"
          />
          <input 
            name="release_month" 
            value={form.release_month} 
            onChange={handleChange} 
            placeholder='Release Month' 
            required 
            className="form-input"
          />
          <input 
            name="release_year" 
            value={form.release_year} 
            onChange={handleChange} 
            placeholder='Release Year' 
            required 
            className="form-input"
          />
          <input 
            name="mov_genre" 
            value={form.mov_genre} 
            onChange={handleChange} 
            placeholder='Movie Genre' 
            required 
            className="form-input"
          />
          <button className="submit-button" type='submit'>
            Update Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;