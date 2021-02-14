import { setCookie } from '../../../library/cookie';
import { onGameUpdate } from './onGameUpdate';
import { onNewPlayer } from '../shared/onNewPlayer';
import { onPlayerStatusChange } from '../shared/onPlayerStatusChange';
import { app } from '../../app';

async function createNewPlayer() {
  console.log('createNewPlayer');

  window.firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      const playerName = getPlayerName();
      setCookie('playerName', playerName);

      const { game } = app.store;
      game.playerType = 'player';

      const gameRef = game.ref;
      const uid = firebase.auth().getUid();
      const registerRef = gameRef.child(`players/register/${uid}`);

      // set status offline
      registerRef.onDisconnect().update({
        s: false,
      });

      // set status online
      registerRef
        .update({
          s: true,
          n: playerName,
        })
        .then(() => {
          gameRef.child('public').on('child_added', onGameUpdate);
          gameRef.child('players/register').on('child_added', onNewPlayer);
          gameRef
            .child('players/register')
            .on('child_changed', onPlayerStatusChange);
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

export { createNewPlayer };
