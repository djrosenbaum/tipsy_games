import { app } from '../app';
import { Game } from '../class/game';

let canStartGame = true;

async function startGame() {
  if (canStartGame) {
    canStartGame = false;
    app.game = await new Game();
    app.game.listen();
  }
}

export {
  startGame,
}