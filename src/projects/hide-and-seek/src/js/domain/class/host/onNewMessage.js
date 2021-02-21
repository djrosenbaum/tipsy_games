import { render } from '../../render';
import { app } from '../../app';
import { get } from 'lodash-es';

// called when a player commits to hiding their treasure
function hide({ payload, playerId }) {
  console.log('hiding treasure', payload);
  const data = JSON.parse(payload);
  console.log('player id:', playerId);
  console.log('data:', data);
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
