import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions, onLikeToggle, currentUserId }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No questions yet. Be the first to ask!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <QuestionCard
              question={question}
              onLikeToggle={onLikeToggle}
              currentUserId={currentUserId}
              rank={index + 1}
              maxLikes={Math.max(...questions.map(q => q.likesCount), 1)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QuestionList;