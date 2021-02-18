import { app } from '../../app';
import { get } from 'lodash-es';

export function getActivePlayers() {
  console.log('get active players');
  const players = get(app, 'store.game.players', {});

  return Object.keys(players).reduce((acc, val) => {
    console.log('val:', val);
    if (players[val].status) {
      acc[val] = players[val];
    }
    return acc;
  }, {});
}
