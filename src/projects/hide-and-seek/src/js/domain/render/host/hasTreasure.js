import { app } from '../../app';
import { get, intersection } from 'lodash-es';

export function hasTreasure() {
  const { hider } = get(window, 'app.game.round') || {};
  const { indexes, guesses = '' } = get(app, `game.players.${hider}`) || {};
  const discoveredTreasure = intersection(
    indexes.split(','),
    guesses.split(',')
  );
  if (discoveredTreasure.length < 3) {
    console.log('has treasure');
    return true;
  }
  console.log('does not have treasure');
  return false;
}
