import { render } from '../../render';
import { app } from '../../app';
import { get, set } from 'lodash-es';

export function onPlayerUpdate(snapshot) {
  console.log('on player update', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  console.log('snapshot does exist', snapshot.exists());
  const { payload, status } = snapshot.toJSON();

  if (status) {
    handleStatus(snapshot);
  }
  if (payload) {
    const message = JSON.parse(payload);
    handlePlayerMessage(snapshot);
  }
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
