import React, { useEffect, useState } from 'react';
import api from '../../services/api.service';
import './QASection.css';

const QASection = ({ productId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [activeAnswerForm, setActiveAnswerForm] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [productId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/products/${productId}/questions`);
      if (response.success && response.data.questions) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/products/${productId}/questions`,
        { question_text: questionText }
      );

      if (response.success) {
        setQuestionText('');
        setShowAskForm(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Please login to ask a question');
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    try {
      const response = await api.post(
        `/products/questions/${questionId}/answers`,
        { answer_text: answerText }
      );

      if (response.success) {
        setAnswerText('');
        setActiveAnswerForm(null);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Please login to answer a question');
    }
  };

  if (loading) {
    return (
      <div className="qa-section loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="qa-section">
      <div className="qa-header">
        <h2 className="qa-title">Customer Questions & Answers</h2>
        <button
          className="ask-question-btn"
          onClick={() => setShowAskForm(!showAskForm)}
        >
          <i className="fas fa-question-circle"></i> Ask a question
        </button>
      </div>

      {showAskForm && (
        <form className="ask-form" onSubmit={handleAskQuestion}>
          <textarea
            className="question-input"
            placeholder="What would you like to know about this product?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit Question</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowAskForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="questions-list">
        {questions.length === 0 ? (
          <p className="no-questions">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="question-item">
              <div className="question-header">
                <div className="question-badge">Q</div>
                <div className="question-content">
                  <p className="question-text">{question.question_text}</p>
                  <p className="question-meta">
                    Asked by {question.users?.first_name} on{' '}
                    {new Date(question.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {question.product_answers && question.product_answers.length > 0 && (
                <div className="answers-list">
                  {question.product_answers.map((answer) => (
                    <div key={answer.id} className="answer-item">
                      <div className="answer-badge">A</div>
                      <div className="answer-content">
                        <p className="answer-text">{answer.answer_text}</p>
                        <p className="answer-meta">
                          {answer.is_seller_answer && (
                            <span className="seller-badge">
                              <i className="fas fa-store"></i> Seller
                            </span>
                          )}
                          Answered by {answer.users?.first_name} on{' '}
                          {new Date(answer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeAnswerForm === question.id ? (
                <form
                  className="answer-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitAnswer(question.id);
                  }}
                >
                  <textarea
                    className="answer-input"
                    placeholder="Your answer..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Submit Answer</button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setActiveAnswerForm(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="answer-question-btn"
                  onClick={() => setActiveAnswerForm(question.id)}
                >
                  <i className="fas fa-reply"></i> Answer this question
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QASection;
