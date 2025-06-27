import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const QuestionCard = ({ question, onLikeToggle, currentUserId, rank, maxLikes }) => {
  const canLike = !!currentUserId;
  const barWidth = (question.likesCount / maxLikes) * 100;

  const handleLikeClick = () => {
    if (canLike) {
      onLikeToggle(question.id, question.isLikedByUser, question.userLikeId);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
        #{rank}
      </div>

      <div className="mb-4">
        <p className="text-gray-800 text-lg mb-2">{question.content}</p>
        <p className="text-sm text-gray-500">
          Asked by {question.userName} • {formatDistanceToNow(new Date(question.created_at))} ago
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLikeClick}
            disabled={!canLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              question.isLikedByUser
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${!canLike ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg
              className="w-5 h-5"
              fill={question.isLikedByUser ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span className="font-medium">{question.likesCount}</span>
          </motion.button>

          <span className="text-sm text-gray-500">
            {!canLike && 'Login to vote'}
          </span>
        </div>

        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {question.likesCount} {question.likesCount === 1 ? 'like' : 'likes'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;