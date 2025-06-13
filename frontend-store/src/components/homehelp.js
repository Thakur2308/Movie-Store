import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const HomeHelp = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/help/all');
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setMessage('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }
}, [message]);

  useEffect(() => {
    fetchQuestions();
    
    // Set up polling to refresh questions every 5 seconds
    const interval = setInterval(fetchQuestions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/help', {
        question: newQuestion
      });
      setMessage('Your question has been submitted!');
      setNewQuestion('');
      fetchQuestions(); // Refresh the list immediately
    } catch (err) {
      console.error("Failed to submit question", err);
      setMessage('Error submitting question.');
    }
  };

  return (
    <div className="help-form-container">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Type your question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Post Question</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Questions & Answers</h3>
      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length > 0 ? (
        questions.map((q) => (
          <div key={q._id} className="help-question-card">
            <p><strong>Q:</strong> {q.question}</p>
            {q.solution ? (
              <div className="answer-section">
                <p><strong>A:</strong> {q.solution}</p>
                {q.replied_by && <p className="answered-by">Answered by: {q.replied_by}</p>}
              </div>
            ) : (
              <p className="no-answer">No answer yet</p>
            )}
          </div>
        ))
      ) : (
        <p>No questions yet. Be the first to ask!</p>
      )}
    </div>
  );
};

export default HomeHelp;