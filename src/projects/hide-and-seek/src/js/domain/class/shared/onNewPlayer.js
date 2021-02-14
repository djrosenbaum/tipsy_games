import { app } from '../../app';
import { get } from 'lodash-es';
import { render } from '../../render';

export function onNewPlayer(snapshot) {
  console.log('onNewPlayer', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  const playerId = snapshot.key;
  const payload = snapshot.toJSON();

  console.log('player id:', playerId);
  console.log('payload:', payload);

  const players = get(app, 'store.game.players');
  const { s, n } = payload;

  players[playerId] = {
    status: s,
    displayName: n,
  };

  render();
}
