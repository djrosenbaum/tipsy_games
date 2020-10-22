import { handleClick } from './handle-click';
import { handleInput } from './handle-input';

function EventListener() {
  document.addEventListener('click', handleClick, false);
  document.addEventListener('input', handleInput, false);
}

export {
  EventListener
};