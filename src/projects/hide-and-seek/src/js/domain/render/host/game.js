import { app } from '../../app';
import { get, shuffle, intersection } from 'lodash-es';
import { getRef } from '../../../library/getRef';

// store the initial html markup, allows for an easy game reset
let initial_markup = '';
let $crates;
let $broadcast;
let $narrative;
let $playAgain;
let currentRound = 0;
const guesses = 3;

function game() {
  console.log('render game');

  const { state } = get(window, 'app.game.round') || '';

  if (state === 'winner') {
    updateRound();
    renderEndGame();
    return;
  }

  // check if there is an existing game state
  if (!window.app.game) {
    // store initial markup for easy reset
    if (!initial_markup) {
      initial_markup = document.querySelector('[data-screen="game"]').innerHTML;
    }
    newGame();
    updatePlayerList();
    return;
  }
  updatePlayerList();

  if (canUpdateRound()) {
    console.log('can update round');
    updateRound();
  } else {
    console.log('can not update round');
    console.log('isReadyToStartRound:', isReadyToStartRound());
    if (isReadyToStartRound()) {
      console.log('ready to start the round');
      startRound();
    }
  }
}

function hasTreasure() {
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

function renderEndGame() {
  console.log('render end game');
  // hide the crates
  $broadcast.innerHTML = 'tally up your treasure';
  $narrative.classList.add('hide');
  $playAgain.classList.remove('hide');
}

function canUpdateRound() {
  return !!get(app, 'game.round.roundNumber');
}

function updateRound() {
  console.log('update round');

  if (!hasTreasure()) {
    console.log('no treasure');
    endTurn();
    return;
  }

  const { hider, seeker, roundNumber, guesses } = get(app, 'game.round') || {};
  console.log('hider:', hider);
  console.log('seeker:', seeker);
  console.log('roundNumber:', roundNumber);
  console.log('guesses:', guesses);

  const { playerList } = app || {};
  console.log('playerList:', playerList);

  $broadcast.innerHTML = `<div>${playerList[seeker].playerName} is seeking</div>`;
  $narrative.innerHTML = `<div>${playerList[hider].playerName} has treasure hidden here</div>`;
  displayGrid(getGridArrayFromPlayer(hider));

  if (!guesses) {
    console.log('Out of guesses, rotate to next player');
    endTurn();
  }
}

async function endTurn() {
  console.log('END TURN');
  const { round, players } = app.game || {};

  let seekers = round.seekers.split(',');
  if (seekers.length === 1) {
    seekers = shuffle(Object.keys(players));
  } else {
    seekers.shift();
  }
  const seeker = seekers[0];

  const totalPlayers = Object.keys(players).length;

  // rotate hider
  let remainingBoards = getRemainingBoards();
  if (remainingBoards.length === 1) {
    console.log('all treasure found');
    broadcastWinner();
    return;
  }

  const filteredBoards = remainingBoards.filter((board) => board !== seeker);

  console.log('total players: ', totalPlayers);
  console.log('remaining boards: ', filteredBoards);

  const hider = shuffle(filteredBoards)[0];

  const _round = {
    guesses,
    hider,
    roundNumber: round.roundNumber,
    seeker,
    seekers: seekers.join(','),
  };

  const ref = getRef();

  await ref
    .child(`game/round`)
    .update(_round)
    .then(() => {
      console.log('updated the round');
    });
}

async function broadcastWinner() {
  console.log('BROADCAST WINNER');

  const ref = getRef();

  await ref
    .child(`game/round`)
    .update({
      state: 'winner',
    })
    .then(() => {
      console.log('display the leaderboard');
    });
}

function getGridArrayFromPlayer(player) {
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

function isReadyToStartRound() {
  if (!app.game) {
    return false;
  }
  return (
    Object.keys(app.playerList).length === Object.keys(app.game.players).length
  );
}

async function startRound() {
  console.log('START ROUND');

  const roundNumber = getRoundNumber();
  if (currentRound === roundNumber) {
    return;
  }
  currentRound = roundNumber;

  const remainingBoards = getRemainingBoards(); // boards that have treasure
  console.log('remaining boards:', remainingBoards);

  // set the seeker
  const seekers = getSeekers();
  console.log('seekers:', seekers);

  const seeker = seekers[0];
  console.log('seeker:', seeker);

  // set the hider
  const hider = shuffle(remainingBoards.filter((board) => board !== seeker))[0];
  console.log('hider:', seeker);

  const round = {
    guesses,
    hider,
    roundNumber,
    seeker,
    seekers: seekers.join(','),
  };

  const ref = getRef();

  await ref
    .child(`game/round`)
    .update(round)
    .then(() => {
      console.log('started the round');
    });
}

function getSeekers() {
  const { players } = app.game || {};
  return shuffle(Object.keys(players));
}

function getRoundNumber() {
  return get(app, 'game.round.roundNumber') || 1;
}

function getRemainingBoards() {
  console.log('get remaining boards');
  const { players } = app.game || {};
  const remainingBoards = [];

  for (const player in players) {
    const { guesses = '', indexes = '' } = players[player];
    const _guesses = guesses.split(',');
    const _indexes = indexes.split(',');
    const discoveredTreasure = intersection(_indexes, _guesses);
    // if there is treasure to be found
    if (discoveredTreasure.length < 3) {
      console.log('treasure remains', player);
      remainingBoards.push(player);
    } else {
      console.log('no treasure remains', player);
    }
  }
  return remainingBoards;
}

async function newGame() {
  document.querySelector('[data-screen="game"]').innerHTML = initial_markup;

  $crates = document.querySelector('[data-screen="game"] .crates');
  $broadcast = document.querySelector('[data-screen="game"] .broadcast');
  $narrative = document.querySelector('[data-screen="game"] .narrative');
  $playAgain = document.querySelector('[data-screen="game"] .play-again');

  $broadcast.innerHTML = 'Time to hide your treasure';
  $broadcast.classList.remove('hide');

  displayGrid(getDefaultGridArray());
}

function getDefaultGridArray() {
  let gridArray = [];
  gridArray.length = 25;
  gridArray.fill(0);
  return gridArray;
}

function displayGrid(gridArray) {
  let markup = gridArray
    .map((item, index) => {
      if (item === 0) {
        return `<div class="crate" data-action="selectCrate" data-index="${index}"></div>`;
      }
      if (item === 1) {
        return `<div class="crate open"></div>`;
      }
      if (item === 2) {
        return `<div class="treasure"></div>`;
      }
    })
    .join('');
  $crates.innerHTML = `<div data-crates="default">${markup}</div>`;
}

function updatePlayerList() {
  const { playerList } = app || {};
  console.log('update player list', playerList);
  const treasureMarkup = '<div class="treasure"></div>';

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } = get(app, `playerList.${player}`) || 'undefined';
      const { treasure } = get(app, `host.game.players.${player}`) || 0;

      return `<div class="player" data-key=${player}><div class="player-name">${playerName}</div>${treasureMarkup.repeat(
        treasure
      )}</div>`;
    })
    .join('');

  const $playerList = document.querySelector(
    '[data-screen="game"] .player-list'
  );
  $playerList.innerHTML = markup;
}

export { game };
