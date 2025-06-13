import axios from 'axios';
import React, { useState } from 'react';

const ReleaseMovie = ({ onMovieAdded }) => {
  const [form, setForm] = useState({
    mov_id: '',
    mov_name: '',
    release_month: '',
    release_year: '',
    mov_genre: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/movies`, 
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Movie Added!");
      onMovieAdded();
      setForm({
        mov_id: '',
        mov_name: '',
        release_month: '',
        release_year: '',
        mov_genre: ''
      });
    } catch (err) {
      console.error("Add movie error:", err);
      alert("Error: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Release Movie</h3>
      <input name="mov_id" value={form.mov_id} onChange={handleChange} placeholder='Movie ID' required /><br />
      <input name="mov_name" value={form.mov_name} onChange={handleChange} placeholder='Movie Name' required /><br />
      <input name="release_month" value={form.release_month} onChange={handleChange} placeholder='Release Month' required /><br />
      <input name="release_year" value={form.release_year} onChange={handleChange} placeholder='Release Year' required /><br />
      <input name="mov_genre" value={form.mov_genre} onChange={handleChange} placeholder='Movie Genre' required /><br />
      <button type='submit'>Add Movie</button>
    </form>
  );
};

export default ReleaseMovie;
