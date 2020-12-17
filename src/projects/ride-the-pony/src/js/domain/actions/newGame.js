import Host from '../class/host';
import { render } from '../render';
import { app } from '../app';

let canCreateNewGame = true;

async function newGame() {
  const { host } = window.app;
  if (host) {
    return;
  }

  if (canCreateNewGame) {
    canCreateNewGame = false;
    document.querySelector('[data-group="player"]').remove();
    app.host = await Host.createNewHost();
    app.host.listen();
    render({
      playerType: 'host',
      screen: 'lobby',
    });
  }
}

export { newGame };
