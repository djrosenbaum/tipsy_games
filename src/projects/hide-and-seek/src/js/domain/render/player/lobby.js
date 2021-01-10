import { app } from '../../app';

function lobby() {
  console.log('render the lobby');

  const { code, playerList } = app;

  if (code) {
    setRoomCode(code);
  }
  if (playerList) {
    updatePlayerList(playerList);
  }

  console.log('beginning to render the lobby');
}

function updatePlayerList(playerList) {
  console.log('update player list', playerList);
  const $playerList = document.querySelector(
    '[data-screen="lobby"] .player-list'
  );
  $playerList.innerHTML = Object.keys(playerList)
    .map(
      (player) =>
        `<div class="player"><div class="crate"></div><span class="player-name">${playerList[player].playerName}</span></div>`
    )
    .join('');
}

function setRoomCode(code) {
  document.querySelector('[data-screen="lobby"] .room-code').innerText = code;
}

export { lobby };
