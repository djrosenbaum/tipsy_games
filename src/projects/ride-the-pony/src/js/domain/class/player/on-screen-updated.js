import { app } from '../../app';
import { render } from '../../render';
import { displayScreen } from '../../../library/display-screen';

function onScreenUpdated(snapshot) {
  console.log('on screen updated', snapshot);
  const screen = snapshot.exists() ? snapshot.toJSON() : '';

  displayScreen(screen);
}

export {
  onScreenUpdated,
}