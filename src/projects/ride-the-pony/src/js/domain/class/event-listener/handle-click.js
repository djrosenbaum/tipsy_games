// import { newGameHost } from '../action/new-game-host';
import { joinGame } from '../../action/join-game';
import { newGame } from '../../action/new-game';
import { startGame } from '../../action/start-game';
import { selectPony } from '../../action/select-pony';
import { raceAgain } from '../../action/race-again';

const actions = {
  join_game: joinGame,
  new_game: newGame,
  start_game: startGame,
  select_pony: selectPony,
  race_again: raceAgain,
}

function handleClick(event) {
  console.log('clicked:', event);
  const action = event.target.dataset.action || '';
  !!action && actions[action](event);
}

export {
  handleClick
}