import { getRef } from '../../get-ref';
import { displayScreen } from '../../../library/display-screen';

async function Game() {
  console.log('get in the game');

  const ref = getRef();

  console.log('ref:', ref);
  console.log('display screen', displayScreen);

  // set screen
  await ref.set({
    screen: 'game_intro',
  }).then(() => {
    displayScreen('game_intro');
  });

  return {
    listen,
  }
}

function listen() {
  console.log('listening');
}

export {
  Game,
}