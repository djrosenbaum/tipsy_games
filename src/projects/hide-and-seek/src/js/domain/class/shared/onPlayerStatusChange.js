import { app } from '../../app';
import { get } from 'lodash-es';
import { render } from '../../render';

export function onPlayerStatusChange(snapshot) {
  console.log('on player status change', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  const playerId = snapshot.key;
  const payload = snapshot.toJSON();

  console.log('player id:', playerId);
  console.log('payload:', payload);

  const players = get(app, 'store.game.players');
  const { s } = payload;

  players[playerId].status = s;

  if (s === true) {
    console.log('player connected');
  }
  if (s === false) {
    console.log('player disconnected');
  }

  render();
}
