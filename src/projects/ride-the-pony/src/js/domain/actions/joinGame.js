/*
  Player clicks Join from the Landing page
*/
import { Player } from '../class/Player';
import { log } from '../../library/log';
import { app } from '../app';

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

const joinGame = async () => {
  // prevent clicking join game multiple times
  if (!canJoinGame) {
    return;
  }
  const { player } = window.app;
  if (player) {
    return;
  }

  canJoinGame = false; // prevent joining multiple times
  const code = getRoomCode();
  const ref = window.firebase.database().ref(`rooms/${code}`);
  let isValidRoom = false;

  // get the room data from firebase
  await ref.once('value').then((snapshot) => {
    const { screen } = snapshot.toJSON() || {};

    if (screen === 'lobby') {
      isValidRoom = true;
    } else {
      canJoinGame = true;
    }
  });

  if (isValidRoom) {
    document.querySelector('[data-group="host"]').remove();
    app.player = await new Player({ code });
    app.player.listen();
  }
};

export { joinGame };
