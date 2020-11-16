import { Player } from '../class/Player';

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
  const { player } = window.app;
  if (player) {
    return;
  }

  canJoinGame = false; // prevent joining multiple times
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
    player = await new Player({ code });
    player.listen();
  }
}

export {
  joinGame,
}