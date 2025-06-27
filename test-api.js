import axios from 'axios';

const AUTH_BASE_URL = 'https://insforge-backend-740c116fd723.herokuapp.com/project';
const DB_BASE_URL = 'https://insforge-backend-740c116fd723.herokuapp.com/database';
const PROJECT_ID = 'cab35892-f3e3-4148-8666-b7deeb1a93b3';
const API_KEY = 'XOBhBjb5edxvJCglaRBsviDq7I4rmbga7t3YqnpmRu8';

const testAuth = async () => {
  console.log('Testing authentication...');
  
  try {
    // Test signup
    const signupData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const signupResponse = await axios.post(
      `${AUTH_BASE_URL}/${PROJECT_ID}/sign-up`,
      signupData
    );
    
    console.log('Signup successful:', signupResponse.data);
    const token = signupResponse.data.token;
    
    // Test login
    const loginResponse = await axios.post(
      `${AUTH_BASE_URL}/${PROJECT_ID}/login`,
      {
        email: signupData.email,
        password: signupData.password
      }
    );
    
    console.log('Login successful:', loginResponse.data);
    
    // Decode token to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.user_id;
    console.log('User ID:', userId);
    
    return { token, userId };
  } catch (error) {
    console.error('Auth test failed:', error.response?.data || error.message);
    throw error;
  }
};

const testDatabase = async (userId) => {
  console.log('\nTesting database operations...');
  
  const dbAxios = axios.create({
    baseURL: DB_BASE_URL,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
  
  try {
    // Create a question
    const questionData = {
      user_id: userId,
      content: 'This is a test question?',
      created_at: new Date().toISOString()
    };
    
    const createResponse = await dbAxios.post(
      '/tables/questions/records',
      [questionData]
    );
    
    console.log('Question created:', createResponse.data);
    const questionId = createResponse.data[0].id;
    
    // Get questions
    const getResponse = await dbAxios.get('/tables/questions/records');
    console.log('Questions retrieved:', getResponse.data);
    
    // Create a like
    const likeData = {
      user_id: userId,
      question_id: questionId,
      created_at: new Date().toISOString()
    };
    
    const likeResponse = await dbAxios.post(
      '/tables/likes/records',
      [likeData]
    );
    
    console.log('Like created:', likeResponse.data);
    
    // Get likes
    const getLikesResponse = await dbAxios.get('/tables/likes/records');
    console.log('Likes retrieved:', getLikesResponse.data);
    
  } catch (error) {
    console.error('Database test failed:', error.response?.data || error.message);
    throw error;
  }
};

const runTests = async () => {
  try {
    const { userId } = await testAuth();
    await testDatabase(userId);
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('\nTests failed:', error);
  }
};

runTests();