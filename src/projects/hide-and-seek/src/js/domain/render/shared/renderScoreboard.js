import { app } from '../../app';
import { get } from 'lodash-es';

const treasureMarkup = '<div class="treasure"></div>';

export function renderScoreboard() {
  const { players, state } = app.store.game;

  const $playerList = document.querySelector(
    '[data-screen="game"] .player-list'
  );
  console.log('render scoreboard', players);

  let markup = Object.keys(players)
    .map((player) => {
      const { displayName } = players[player];
      const treasure =
        get(app, `store.game.state.players.${player}.treasure`) || 0;

      return `<div class="player" data-key=${player}><div class="player-name">${displayName}</div>${treasureMarkup.repeat(
        treasure
      )}</div>`;
    })
    .join('');

  $playerList.innerHTML = markup;
}
