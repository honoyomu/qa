import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../api/insforge';
import QuestionForm from '../components/QuestionForm';
import QuestionList from '../components/QuestionList';

const Home = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const [questionsData, likesData, usersData] = await Promise.all([
        db.getRecords('questions'),
        db.getRecords('likes'),
        db.getRecords('users'),
      ]);

      const userMap = {};
      usersData.data.forEach(user => {
        userMap[user.id] = user;
      });

      const likesCountMap = {};
      const userLikesMap = {};
      
      likesData.data.forEach(like => {
        likesCountMap[like.question_id] = (likesCountMap[like.question_id] || 0) + 1;
        if (user && like.user_id === user.id) {
          userLikesMap[like.question_id] = like.id;
        }
      });

      const enrichedQuestions = questionsData.data.map(question => ({
        ...question,
        userName: userMap[question.user_id]?.name || 'Anonymous',
        likesCount: likesCountMap[question.id] || 0,
        isLikedByUser: !!userLikesMap[question.id],
        userLikeId: userLikesMap[question.id],
      }));

      enrichedQuestions.sort((a, b) => b.likesCount - a.likesCount);
      
      setQuestions(enrichedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleQuestionAdded = () => {
    fetchQuestions();
  };

  const handleLikeToggle = async (questionId, isLiked, userLikeId) => {
    if (!user) return;

    try {
      if (isLiked && userLikeId) {
        await db.deleteRecord('likes', userLikeId);
      } else {
        await db.createRecord('likes', {
          user_id: user.id,
          question_id: questionId,
          created_at: new Date().toISOString(),
        });
      }
      fetchQuestions();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent -z-10" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Audience Q&A</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Ask questions and vote for the best ones
          </p>
        </motion.div>
        
        {user ? (
          <QuestionForm onQuestionAdded={handleQuestionAdded} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-8 mb-8 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Join the conversation
            </h3>
            <p className="text-gray-400 mb-6">
              Sign in to ask questions and vote for your favorites
            </p>
            <Link to="/auth">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium rounded-lg shadow-glow hover:shadow-glow-lg transition-all"
              >
                Sign in to participate
              </motion.span>
            </Link>
          </motion.div>
        )}
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-200">
            {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
          </h2>
          {questions.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live updates</span>
            </div>
          )}
        </div>
        
        <QuestionList 
          questions={questions} 
          onLikeToggle={handleLikeToggle}
          currentUserId={user?.id}
        />
      </div>
    </div>
  );
};

export default Home;