import { displayScreen } from '../../../library/displayScreen';
import { onPlayerListUpdated } from './onPlayerListUpdated';
import { onScreenUpdated } from './onScreenUpdated';
import { setCookie } from '../../../library/cookie';
import { onGameUpdated } from './onGameUpdated';

async function createNewPlayer({ code }) {
  console.log('new player');
  const ref = window.firebase.database().ref(`rooms/${code}`);
  let playerKey = '';
  let playerList = '';
  const playerName = getPlayerName();
  setCookie('playerName', playerName);

  await ref
    .child('players')
    .push({
      playerName,
    })
    .then((data) => {
      console.log('player set');
      playerKey = data.getKey();
      // remove player when disconnected
      ref.child('players').child(playerKey).onDisconnect().remove();
      console.log('display lobby');
      displayScreen('lobby');
    });

  return {
    code,
    listen,
    playerKey,
    playerList,
    ref,
  };
}

function getPlayerName() {
  console.log('get player name');
  let playerName =
    document.querySelector('[data-input="player-name"]').value || 'guest';
  return playerName;
}

function listen() {
  console.log('listening');
  const { ref } = window.app.player;
  ref.child('players').on('value', onPlayerListUpdated);
  ref.child('screen').on('value', onScreenUpdated);
  ref.child('game').on('value', onGameUpdated);
}

export { createNewPlayer };
