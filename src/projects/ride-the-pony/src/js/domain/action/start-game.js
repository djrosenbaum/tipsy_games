import { setScreen } from '../../library/set-screen';

async function startGame() {
  console.log('start game');
  const { screen } = window.app;
  if (screen !== 'game_intro') {
    setScreen('game_intro');
  }
}

export {
  startGame,
}