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

  const getRankColor = () => {
    if (rank === 1) return 'from-yellow-400 to-amber-400';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-500';
    return 'from-gray-600 to-gray-700';
  };

  return (
    <motion.div
      className="glass-card rounded-xl p-6 relative overflow-hidden group"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Rank Badge */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`absolute -top-1 -right-1 w-12 h-12 rounded-bl-2xl bg-gradient-to-br ${getRankColor()} flex items-center justify-center shadow-lg`}
      >
        <span className="text-white font-bold text-sm">
          {rank}
        </span>
      </motion.div>

      {/* Question Content */}
      <div className="mb-6">
        <p className="text-gray-100 text-lg font-medium leading-relaxed mb-3">
          {question.content}
        </p>
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {question.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-400">{question.userName}</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="text-gray-500">
            {formatDistanceToNow(new Date(question.created_at))} ago
          </span>
        </div>
      </div>

      {/* Vote Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: canLike ? 1.05 : 1 }}
            whileTap={{ scale: canLike ? 0.95 : 1 }}
            onClick={handleLikeClick}
            disabled={!canLike}
            className={`
              flex items-center space-x-3 px-5 py-2.5 rounded-lg font-medium transition-all duration-200
              ${question.isLikedByUser
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-glow'
                : 'glass-button text-gray-300 hover:text-white'
              } 
              ${!canLike ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
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
            <span>{question.likesCount}</span>
          </motion.button>

          {!canLike && (
            <span className="text-sm text-gray-500">
              Sign in to vote
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${barWidth}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0</span>
            <span className="text-xs text-gray-400 font-medium">
              {question.likesCount} {question.likesCount === 1 ? 'vote' : 'votes'}
            </span>
            <span className="text-xs text-gray-500">{maxLikes}</span>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
    </motion.div>
  );
};

export default QuestionCard;