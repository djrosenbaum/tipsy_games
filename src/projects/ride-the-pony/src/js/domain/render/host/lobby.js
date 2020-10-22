import { app } from '../../app';

function lobby() {
  console.log('render the lobby');
  const minimumPlayers = 2;

  const { code, playerList } = app.host;

  if (code) {
    setRoomCode(code);
  }
  updatePlayerList(playerList);
  updateStartRaceButton(playerList, minimumPlayers);

  console.log('beginning to render the lobby');
}

function updateStartRaceButton(playerList, minimumPlayers) {
  const totalPlayers = Object.keys(playerList).length;
  const startRaceButtonWrapper = document.querySelector('[data-screen="lobby"] button[data-action="start_game"]').parentNode;

  if (totalPlayers < minimumPlayers) {
    startRaceButtonWrapper.classList.add('hide');
    return;
  }
    startRaceButtonWrapper.classList.remove('hide');
}

function updatePlayerList(playerList) {
  console.log('update player list', playerList);

  let markup = Object.keys(playerList).map(player => {
    const playerName = playerList[player].playerName;
    return `<div class="track"><div class="horse"></div><div class="player-name">${ playerName }</div></div>`;
  }).join('');

  const track = document.querySelector('[data-screen="lobby"] .tracks');
  track.innerHTML = markup;
}

function setRoomCode(code) {
  document.querySelector('[data-screen="lobby"] .room-code').innerText = code;
}

export {
  lobby
}