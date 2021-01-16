import { app } from '../../app';
import { get } from 'lodash-es';
import { getDefaultGridArray } from './getDefaultGridArray';

export function getGridArrayFromPlayer(player) {
  console.log('getGridArrayFromPlayer', player);
  const grid = getDefaultGridArray();
  const { indexes, guesses } = get(app, `game.players.${player}`) || {};

  if (guesses) {
    const indexesArray = indexes.split(',');
    console.log('indexesArray', indexesArray);
    guesses.split(',').forEach((guess) => {
      const index = Number(guess);
      console.log('guess index:', index);
      grid[index] = 1;
      if (indexesArray.includes(index.toString())) {
        grid[index] = 2;
      }
    });
  }

  return grid;
}
