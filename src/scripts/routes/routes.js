import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page'
import LoginPage from '../pages/auth/login/login-page'

const routes = {
  '/': new HomePage(),

  '/register': new RegisterPage(),
  '/login': new LoginPage(),
  
  // '/stories': new AddNewStoryPage(),
  // '/stories': new GetAllStoriesPage(),
  // '/stories/:id': new DetailStoryPage(),
};

export default routes;
