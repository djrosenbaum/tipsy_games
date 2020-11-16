import { addEventListeners } from './addEventListeners';
import { autofill } from './autofill';
import { app } from './app';
import { log } from '../library/log';

/**
 * Initializes the application
 * 
 * @returns {undefined} undefined
 */
const init = () => {
  log('init');
  window.app = app;
  autofill();
  addEventListeners();
};

export {
  init
}