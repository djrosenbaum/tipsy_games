/*
  Player clicks Join from the Landing page
*/
import { createNewPlayer } from '../class/Player';
import { log } from '../../library/log';
import { app } from '../app';
import { firebaseConfig } from '../../domain/firebase/firebaseConfig';
import { getRef } from '../../library/getRef';
import { set } from 'lodash-es';

/**
 * Gets a room code from html <input> field
 *
 * @returns {string} value of the room code input field
 */
const getRoomCode = () => {
  log('getRoomCode');
  let roomCode = document.querySelector('[data-input="room-code"]').value;
  return roomCode.toLowerCase();
};

async function joinGame() {
  // prevent clicking join game multiple times
  if (app.store.isBusy) {
    return;
  }

  const channelId = getRoomCode();
  if (!channelId) {
    return;
  }

  app.store.isBusy = true;
  // initialize Firebase
  window.firebase.initializeApp(firebaseConfig);

  // check if can join room
  const gameRef = getRef(`games/${channelId}`);
  set(app, 'store.game.ref', gameRef);
  gameRef
    .child('can_join')
    .once('value')
    .then((snapshot) => {
      const canJoin = snapshot.toJSON();
      if (canJoin) {
        set(app, 'store.game.channelId', channelId);
        createNewPlayer();
      } else {
        app.store.isBusy = false;
      }
    })
    .catch((error) => {
      console.error(error);
      app.store.isBusy = false;
    });
}

export { joinGame };
