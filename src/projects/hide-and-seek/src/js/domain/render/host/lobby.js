import { app } from '../../app';

function lobby() {
  console.log('render the lobby');
  const minimumPlayers = 2;

  const { code, playerList } = app;

  if (code) {
    setRoomCode(code);
  }
  updatePlayerList(playerList);
  updateStartGameButton(playerList, minimumPlayers);

  console.log('beginning to render the lobby');
}

function updateStartGameButton(playerList, minimumPlayers) {
  const totalPlayers = Object.keys(playerList).length;
  const startGameButtonWrapper = document.querySelector(
    '[data-screen="lobby"] button[data-action="startGame"]'
  ).parentNode;

  if (totalPlayers < minimumPlayers) {
    startGameButtonWrapper.classList.add('hide');
    return;
  }
  startGameButtonWrapper.classList.remove('hide');
}

function updatePlayerList(playerList) {
  console.log('update player list', playerList);

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } = playerList[player];
      return `<div class="crate-wrapper"><div class="crate reflect"></div><div class="player-name">${playerName}</div></div>`;
    })
    .join('');

  const crates = document.querySelector('[data-screen="lobby"] .crates');
  crates.innerHTML = markup;
}

function setRoomCode(code) {
  document.querySelector('[data-screen="lobby"] .room-code').innerText = code;
}

export { lobby };
