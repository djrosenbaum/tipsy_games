import { render } from '../../render';
import { app } from '../../app';
import { get, set } from 'lodash-es';

// called when a player commits to hiding their treasure
function hide({ payload, playerId }) {
  console.log('hiding treasure', payload);
  const data = JSON.parse(payload);
  console.log('player id:', playerId);
  console.log('data:', data);

  // TO DO validate the hidden treasure data
  // . player treasure has not been hidden yet
  // . should be an array with 3 different valid indexes

  set(app, `store.game.state.local.hiddenTreasure.${playerId}`, data);

  const gameRef = app.store.game.ref;
  gameRef.child('public').push({
    type: 'hidden',
    payload: JSON.stringify({
      playerId,
    }),
  });
}

const handleMessage = {
  hide,
};

export function onNewMessage(snapshot) {
  console.log('on new message', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }

  const playerId = snapshot.key;
  const message = snapshot.toJSON();

  for (const key in message) {
    console.log('message:', message[key]);
    let { payload, type } = message[key];
    handleMessage[type]({ payload, playerId });
  }

  // render the current game screen
  render();
}
