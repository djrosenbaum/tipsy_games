import { app } from '../../app';
import { get, remove, set, shuffle, intersection } from 'lodash-es';
import { getRef } from '../../../library/getRef';

let currentRound = 0;

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
    if (!app.initial_markup) {
      app.initial_markup = document.querySelector(
        '[data-screen="game"]'
      ).innerHTML;
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
  const { dom } = app;
  // hide the crates
  dom.$broadcast.innerHTML = 'tally up your treasure';
  dom.$narrative.classList.add('hide');
  dom.$playAgain.classList.remove('hide');
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

  const { dom } = app;

  dom.$broadcast.innerHTML = `<div>${playerList[seeker].playerName} is seeking</div>`;
  dom.$narrative.innerHTML = `<div>${playerList[hider].playerName} has treasure hidden here</div>`;
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

  const remainingBoards = getRemainingBoards();

  let hiders = get(app, 'local.hiders') || [];
  if (!hiders.length) {
    hiders = remainingBoards;
  }

  const totalPlayers = Object.keys(players).length;

  // rotate hider
  if (remainingBoards.length === 1) {
    console.log('all treasure found');
    broadcastWinner();
    return;
  }

  const filteredBoards = hiders.filter((board) => board !== seeker);

  console.log('total players: ', totalPlayers);
  console.log('remaining boards: ', filteredBoards);

  const hider = shuffle(filteredBoards)[0];
  remove(hiders, (item) => item === hider);

  const _round = {
    guesses: 3,
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

  // look into removing round number
  const roundNumber = getRoundNumber();
  if (currentRound === roundNumber) {
    return;
  }
  currentRound = roundNumber;

  // get available hiders
  const hiders = getHiders();
  set(app, 'local.hiders', hiders);
  console.log('hiders:', hiders);

  // get available seekers
  const seekers = getSeekers();
  console.log('seekers:', seekers);

  const seeker = seekers[0];
  console.log('seeker:', seeker);

  // set the hider
  const hider = shuffle(hiders.filter((board) => board !== seeker))[0];
  console.log('hider:', seeker);

  const round = {
    guesses: 3,
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

function getHiders() {
  console.log('getHiders()');
  const hiders = get(app, 'local.hiders') || getRemainingBoards();
  console.log('hiders', hiders);
  return shuffle(hiders);
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
  console.log('newGame()');
  document.querySelector('[data-screen="game"]').innerHTML = app.initial_markup;

  const dom = {};
  app.dom = dom;

  dom.$crates = document.querySelector('[data-screen="game"] .crates');
  dom.$broadcast = document.querySelector('[data-screen="game"] .broadcast');
  dom.$narrative = document.querySelector('[data-screen="game"] .narrative');
  dom.$playAgain = document.querySelector('[data-screen="game"] .play-again');

  dom.$broadcast.innerHTML = 'Time to hide your treasure';
  dom.$broadcast.classList.remove('hide');

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
  app.dom.$crates.innerHTML = `<div data-crates="default">${markup}</div>`;
}

function updatePlayerList() {
  const { playerList } = app || {};
  console.log('update player list', playerList);
  const treasureMarkup = '<div class="treasure"></div>';

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } = get(app, `playerList.${player}`) || 'undefined';
      const { treasure } = get(app, `game.players.${player}`) || 0;

      return `<div class="player" data-key=${player}><div class="player-name">${playerName}</div>${treasureMarkup.repeat(
        treasure
      )}</div>`;
    })
    .join('');

  app.dom.$playerList = document.querySelector(
    '[data-screen="game"] .player-list'
  );
  app.dom.$playerList.innerHTML = markup;
}

export { game };
