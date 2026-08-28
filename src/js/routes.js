
import HomePage from '../pages/home.f7';
import ReadPage from '../pages/read.f7';
import HistoryPage from '../pages/history.f7';
import AboutPage from '../pages/about.f7';
import FormPage from '../pages/form.f7';
import CodesPage from '../pages/codes.f7';
import ProductPage from '../pages/product.f7';
import SettingsPage from '../pages/settings.f7';
import NotFoundPage from '../pages/404.f7';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/read/',
    component: ReadPage,
  },
  {
    path: '/history/',
    component: HistoryPage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/codes/',
    component: CodesPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;