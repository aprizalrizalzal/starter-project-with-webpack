// CSS imports
import '../styles/style.css';
import '../styles/responsive.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app';
import Camera from './utils/media/camera';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    Camera.stopAllStreams();
  });
});
