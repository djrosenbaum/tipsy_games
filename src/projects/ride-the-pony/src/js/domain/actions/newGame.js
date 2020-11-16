import { Host } from '../class/Host';
import { render } from '../render';

let canCreateNewGame = true;

async function newGame() {
  const { host } = window.app;
  if (host) {
    return;
  }

  if (canCreateNewGame) {
    canCreateNewGame = false;
    document.querySelector('[data-group="player"]').remove();
    host = await new Host();
    host.listen();
    render({
      playerType: 'host',
      screen: 'lobby',
    });
  }
}

export {
  newGame,
}