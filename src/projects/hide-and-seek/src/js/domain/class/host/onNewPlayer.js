import { app } from '../../app';
import { get } from 'lodash-es';

export function onNewPlayer(snapshot) {
  console.log('on player register', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  console.log('snapshot:', snapshot.toJSON());
  const playerId = snapshot.key;
  console.log('player id:', playerId);
  // const gameRef = get(app, 'store.game.ref');
  // listen for player status change
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
