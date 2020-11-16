import { app } from '../app';
import { Host } from '../class/host';
import { render } from '../render';

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
    render({
      playerType: 'host',
      screen: 'lobby',
    });
  }
}

export {
  newGame,
}