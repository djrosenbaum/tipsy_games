import { app } from '../app';
import { Host } from '../class/host';

let canCreateNewGame = true;

async function newGame() {
  if (app.host) {
    return;
  }

  if (canCreateNewGame) {
    canCreateNewGame = false;
    document.querySelector('[data-group="player"]').remove();
    app.host = await new Host();
    app.host.listen();
  }
}

export {
  newGame,
}