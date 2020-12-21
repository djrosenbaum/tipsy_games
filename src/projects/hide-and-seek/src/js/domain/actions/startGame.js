import { setScreen } from '../../library/setScreen';

async function startGame() {
  console.log('start game');
  const { screen } = window.app;
  if (screen !== 'game') {
    setScreen('game');
  }
}

export { startGame };
