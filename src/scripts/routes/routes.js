import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page'
import LoginPage from '../pages/auth/login/login-page'
import { checkAuthenticated, checkUnauthenticated } from '../utils/auth';
import AddNewStoryPage from '../pages/add/add-new-story-page';

const routes = {
  '/': () => new HomePage(),

  '/register': () => checkUnauthenticated(new RegisterPage()),
  '/login': () => checkUnauthenticated(new LoginPage()),
  
  '/add': () => checkAuthenticated(new AddNewStoryPage()),
  // '/stories': () => new GetAllStoriesPage(),
  // '/stories/:id': () => new DetailStoryPage(),
};

export default routes;
