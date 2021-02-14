import { addEventListeners } from './dom/addEventListeners';
import { autofill } from './dom/autofill';
import { app } from './app';
import { log } from '../library/log';

/**
 * Initializes the application
 *
 * @returns {undefined} undefined
 */
const init = () => {
  log('init');
  // expose the app for easy troubleshooting in browser
  window.app = app;
  addEventListeners();
  autofill();
};

export { init };
