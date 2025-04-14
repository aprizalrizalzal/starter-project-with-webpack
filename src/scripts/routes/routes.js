import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page'
import LoginPage from '../pages/auth/login/login-page'
import { checkAuthenticated, checkUnauthenticated } from '../utils/auth';

const routes = {
  '/': () => new HomePage(),

  '/register': () => checkUnauthenticated(new RegisterPage()),
  '/login': () => checkUnauthenticated(new LoginPage()),
  
  // '/stories': () => new AddNewStoryPage(),
  // '/stories': () => new GetAllStoriesPage(),
  // '/stories/:id': () => new DetailStoryPage(),
};

export default routes;
