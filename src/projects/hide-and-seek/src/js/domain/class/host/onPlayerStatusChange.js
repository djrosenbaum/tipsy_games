import { app } from '../../app';
import { get } from 'lodash-es';

export function onPlayerStatusChange(snapshot) {
  console.log('on player status change', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  const playerId = snapshot.key;
  const payload = snapshot.toJSON();

  console.log('playerId:', playerId);
  console.log('payload:', payload);

  // if (status === true) {
  //   console.log('player connected');
  // }
  // if (status === false) {
  //   console.log('player disconnected');
  // }
}

function handlePlayerMessage(message) {
  console.log('handling player message', message);
}

function handleStatus(snapshot) {
  const uid = snapshot.key;
  const { status } = snapshot.toJSON();
  const gameRef = get(app, 'store.game.ref');
  gameRef.child('public').push({
    payload: JSON.stringify({
      players: {
        [uid]: {
          status,
        },
      },
    }),
  });
}
