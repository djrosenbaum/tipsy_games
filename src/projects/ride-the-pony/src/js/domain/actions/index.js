// import { newGameHost } from '../action/new-game-host';
import { joinGame } from '../../actions/joinGame';
import { newGame } from '../../actions/newGame';
import { startGame } from '../../actions/startGame';
import { selectPony } from '../../actions/selectPony';
import { raceAgain } from '../../actions/raceAgain';

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