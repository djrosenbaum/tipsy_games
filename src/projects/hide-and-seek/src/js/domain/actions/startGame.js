import { setScreen } from '../../library/setScreen';
import { app } from '../app';

async function startGame() {
  console.log('start game');
  const { screen } = app;
  if (screen !== 'game') {
    setScreen('game');
  }
}

export { startGame };
