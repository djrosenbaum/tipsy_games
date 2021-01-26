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
      const userRef = getRef(`games/${channelId}/private/${uid}`);

      userRef.onDisconnect().update({
        message: JSON.stringify({
          status: 'offline',
        }),
      });

      userRef
        .set({
          message: JSON.stringify({
            playerName,
            status: 'online',
          }),
        })
        .then(() => {
          console.log('is connected', uid);
        });
    })
    .catch((error) => {
      console.error(error);
    });

  // .push({
  //   playerName,
  // })
  // .then((data) => {
  //   console.log('player set');
  //   playerKey = data.getKey();
  //   // remove player when disconnected
  //   ref.child('players').child(playerKey).onDisconnect().remove();
  //   console.log('display lobby');
  //   displayScreen('lobby');

  // document.querySelector('[data-group="host"]').remove();

  // const ref = window.firebase.database().ref(`rooms/${code}`);
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
