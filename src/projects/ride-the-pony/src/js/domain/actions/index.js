/*
  Index of click handler actions
  set actions on clickable html elements
  ie: <button data-action="joinGame"></button>
*/

import { joinGame } from './joinGame';
import { newGame } from './newGame';
import { startGame } from './startGame';
import { selectPony } from './selectPony';
import { raceAgain } from './raceAgain';

const actions = {
  joinGame,
  newGame,
  startGame,
  selectPony,
  raceAgain,
}

export {
  actions
}