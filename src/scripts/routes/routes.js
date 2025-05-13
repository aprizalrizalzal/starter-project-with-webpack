import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page'
import LoginPage from '../pages/auth/login/login-page'
import { checkAuthenticated, checkUnauthenticated } from '../utils/auth';
import AddNewStoryPage from '../pages/add/add-new-story-page';
import DetailPage from '../pages/detail/detail-page';
import FavoritePage from '../pages/favorite/favorite-page';

const routes = {
  '/': () => new HomePage(),

  '/register': () => checkUnauthenticated(new RegisterPage()),
  '/login': () => checkUnauthenticated(new LoginPage()),
  
  '/add': () => checkAuthenticated(new AddNewStoryPage()),
  '/stories/:id': () => checkAuthenticated(new DetailPage()),
  '/favorite': () => checkAuthenticated(new FavoritePage()),
};

export default routes;
