import { displayScreen } from '../../../library/displayScreen';
import { onPlayerListUpdated } from './onPlayerListUpdated';
import { onScreenUpdated } from './onScreenUpdated';
import { setCookie } from '../../../library/cookie';
import { onGameUpdated } from './onGameUpdated';
import { app } from '../../app';
import { get } from 'lodash-es';
import { getRef } from '../../../library/getRef';

async function createNewPlayer() {
  console.log('createNewPlayer');

  window.firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      const playerName = getPlayerName();
      setCookie('playerName', playerName);

      const uid = firebase.auth().getUid();
      const channelId = get(app, 'store.game.channelId');
      const registerRef = getRef(`games/${channelId}/players/register/${uid}`);

      // todo check if player exists and is reconnecting

      // set status offline
      registerRef.onDisconnect().update({
        s: false,
      });

      // set status online
      registerRef.update({
        s: true,
        n: playerName,
      });

      document.querySelector('[data-group="host"]').remove();
    })
    .catch((error) => {
      console.error(error);
    });
}

function getPlayerName() {
  console.log('get player name');
  let playerName =
    document.querySelector('[data-input="player-name"]').value || 'guest';
  return playerName;
}

// function listen() {
//   console.log('listening');
//   const { ref } = app;
//   ref.child('players').on('value', onPlayerListUpdated);
//   ref.child('screen').on('value', onScreenUpdated);
//   ref.child('game').on('value', onGameUpdated);
// }

export { createNewPlayer };
