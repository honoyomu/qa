import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../api/insforge';

const QuestionForm = ({ onQuestionAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await db.createRecord('questions', {
        user_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
      });
      setContent('');
      onQuestionAdded();
    } catch (error) {
      console.error('Error posting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Ask a Question
        </label>
        <textarea
          id="question"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="What would you like to know?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Posting...' : 'Post Question'}
      </button>
    </form>
  );
};

export default QuestionForm;