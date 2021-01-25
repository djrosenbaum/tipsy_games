/*
  Player clicks Join from the Landing page
*/
import { createNewPlayer } from '../class/Player';
import { log } from '../../library/log';
import { app } from '../app';
import { firebaseConfig } from '../../domain/firebase/firebaseConfig';
import { getRef } from '../../library/getRef';
import { set } from 'lodash-es';

let canJoinGame = true;

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
  if (!canJoinGame) {
    return;
  }
  canJoinGame = false; // prevent joining multiple times

  const channelId = getRoomCode();
  if (!channelId) {
    canJoinGame = true;
    return;
  }

  // initialize Firebase
  window.firebase.initializeApp(firebaseConfig);

  // check if can join room
  const gameRef = getRef(`games/${channelId}`);
  gameRef
    .child('can_join')
    .once('value')
    .then((snapshot) => {
      const canJoin = snapshot.toJSON();
      if (canJoin) {
        set(app, 'store.game.channelId', channelId);
        createNewPlayer();
      } else {
        canJoinGame = true;
      }
    })
    .catch((error) => {
      console.error(error);
      canJoinGame = true;
    });
}

export { joinGame };
