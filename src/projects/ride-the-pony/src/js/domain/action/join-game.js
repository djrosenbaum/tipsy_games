import { app } from '../app';
import { Player } from '../class/player';

let canJoinGame = true;

function getRoomCode() {
  console.log('get room code');
  let roomCode = document.querySelector('[data-input="room-code"]').value;  
  return roomCode.toLowerCase();
}

async function joinGame() {
  // prevent clicking join game multiple times
  if (!canJoinGame) {
    return;
  }
  if (app.player) {
    return;
  }

  canJoinGame = false;
  const code = getRoomCode();
  const ref = window.firebase.database().ref(`rooms/${code}`);
  let isValidRoom = false;
  
  // get the room data from firebase
  await ref.once('value').then(snapshot => {
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
}

export {
  joinGame,
}