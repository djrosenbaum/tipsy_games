import { displayScreen } from '../../../library/display-screen';
import { onPlayerListUpdated } from './on-player-list-updated';
import { onScreenUpdated } from './on-screen-updated';
import { app } from '../../app';

async function Player({ code }) {
  const ref = window.firebase.database().ref(`rooms/${code}`);
  let playerKey = '';
  let playerList = '';

  await ref.child('players').push({
    playerName: getPlayerName(),
  }).then(data => {
    console.log('player set');
    playerKey = data.getKey();
    // remove player when disconnected
    ref.child('players').child(playerKey).onDisconnect().remove();
    displayScreen('lobby');
  });

  return {
    code,
    listen,
    playerKey,
    playerList,
    ref,
  }
}

function getPlayerName() {
  console.log('get player name');
  let playerName = document.querySelector('[data-input="player-name"]').value || 'guest';
  return playerName.toLowerCase();
}

function listen() {
  console.log('listening');
  const { ref } = app.player;
  ref.child('players').on('value', onPlayerListUpdated);
  ref.child('screen').on('value', onScreenUpdated);
}

export {
  Player,
}