import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const ProducerHelp = ({ username }) => {
  const [questions, setQuestions] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUnansweredQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/help/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setMessage('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnansweredQuestions();
  }, []);

  const handleSolutionChange = (questionId, solution) => {
    setSolutions(prev => ({
      ...prev,
      [questionId]: solution
    }));
  };

  const submitSolution = async (questionId) => {
    if (!solutions[questionId]?.trim()) {
      setMessage('Please enter a solution');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/help/user/${username}`, {
        question_id: questionId,
        solution: solutions[questionId]
      });
      setMessage('Solution submitted successfully!');
      setSolutions(prev => {
        const newSolutions = { ...prev };
        delete newSolutions[questionId];
        return newSolutions;
      });
      fetchUnansweredQuestions(); // Refresh the list
    } catch (err) {
      console.error("Failed to submit solution", err);
      setMessage('Error submitting solution.');
    }
  };

  return (
    <div className="producer-help-container">
      <h2>Answer Questions</h2>
      {message && <p className={`message ${message.includes('Error') ? 'error' : ''}`}>{message}</p>}

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length > 0 ? (
        questions.map((q) => (
          <div key={q._id} className="question-card">
            <p><strong>Question:</strong> {q.question}</p>
            <textarea
              placeholder="Type your answer..."
              value={solutions[q._id] || ''}
              onChange={(e) => handleSolutionChange(q._id, e.target.value)}
              required
            />
            <button
              onClick={() => submitSolution(q._id)}
              disabled={!solutions[q._id]?.trim()}
            >
              Submit Answer
            </button>
          </div>
        ))
      ) : (
        <p>No unanswered questions at the moment.</p>
      )}
    </div>
  );
};

export default ProducerHelp;