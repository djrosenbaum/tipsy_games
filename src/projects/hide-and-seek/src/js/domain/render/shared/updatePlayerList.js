import { app } from '../../app';
import { get } from 'lodash-es';

export function updatePlayerList() {
  const { playerList } = app || {};
  console.log('update player list', playerList);
  const treasureMarkup = '<div class="treasure"></div>';

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } = get(app, `playerList.${player}`) || 'undefined';
      const { treasure } = get(app, `game.players.${player}`) || 0;

      return `<div class="player" data-key=${player}><div class="player-name">${playerName}</div>${treasureMarkup.repeat(
        treasure
      )}</div>`;
    })
    .join('');

  app.dom.$playerList = document.querySelector(
    '[data-screen="game"] .player-list'
  );
  app.dom.$playerList.innerHTML = markup;
}
