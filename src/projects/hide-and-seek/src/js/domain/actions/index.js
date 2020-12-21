/*
  Index of click handler actions
  set actions on clickable html elements
  ie: <button data-action="joinGame"></button>
*/

import { commit } from './commit';
import { joinGame } from './joinGame';
import { newGame } from './newGame';
import { playAgain } from './playAgain';
import { selectCrate } from './selectCrate';
import { startGame } from './startGame';

const actions = {
  commit,
  joinGame,
  newGame,
  playAgain,
  selectCrate,
  startGame,
};

export { actions };
