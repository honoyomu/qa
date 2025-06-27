import { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Audience Q&A
        </h1>
        
        {user && (
          <QuestionForm onQuestionAdded={handleQuestionAdded} />
        )}
        
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