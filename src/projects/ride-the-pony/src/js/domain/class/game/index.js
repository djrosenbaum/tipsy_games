import { getRef } from '../../get-ref';
import { render } from '../../render';
import { displayScreen } from '../../../library/display-screen';

async function Game() {
  console.log('get in the game');

  const ref = getRef();

  // set screen
  await ref.update({
    screen: 'game_intro',
  }).then(() => {
    render({
      playerType: 'host',
      screen: 'game_intro',
    });
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