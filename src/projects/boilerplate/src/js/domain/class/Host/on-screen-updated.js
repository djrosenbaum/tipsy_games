import { displayScreen } from '../../../library/display-screen';

function onScreenUpdated(snapshot) {
  const screen = snapshot.toJSON();
  console.log('on screen updated:', screen);
  // renderScreen(screen);
  displayScreen(screen);
}

export {
  onScreenUpdated,
}