import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../api/insforge';

const QuestionForm = ({ onQuestionAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="mb-8 glass-card rounded-xl p-6"
    >
      <div className="mb-5">
        <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-3">
          Ask your question
        </label>
        <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
          <textarea
            id="question"
            rows={3}
            className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 placeholder-gray-500 border border-gray-700/50 rounded-lg focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
            placeholder="What would you like to know?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSubmitting}
          />
          <div className={`absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-lg pointer-events-none transition-opacity duration-200 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {content.length}/500 characters
          </span>
          {content.length > 400 && (
            <span className="text-xs text-amber-400">
              Approaching character limit
            </span>
          )}
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!content.trim() || isSubmitting || content.length > 500}
        className={`
          relative px-6 py-2.5 font-medium rounded-lg transition-all duration-200 overflow-hidden
          ${!content.trim() || isSubmitting || content.length > 500
            ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-glow hover:shadow-glow-lg'
          }
        `}
      >
        <span className="relative z-10">
          {isSubmitting ? 'Posting...' : 'Post Question'}
        </span>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
    </motion.form>
  );
};

export default QuestionForm;