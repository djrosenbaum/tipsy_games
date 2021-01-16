import { app } from '../../app';
import { get } from 'lodash-es';

export function canUpdateRound() {
  return get(app, 'game.round');
}
