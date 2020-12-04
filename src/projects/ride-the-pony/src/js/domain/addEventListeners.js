import { handleClick } from '../library/handleClick';
import { log } from '../library/log';
// import { handleInput } from '../library/handleInput';

export const addEventListeners = () => {
  log('add event listeners');
  document.addEventListener('click', handleClick, false);
  // document.addEventListener('input', handleInput, false);
};
