import { app } from '../../app';
import { get, shuffle } from 'lodash-es';
import { getRef } from '../../../library/getRef';

// store the initial html markup, allows for an easy game reset
let initial_markup = '';
let $crates;
let $broadcast;
let $narrative;
let currentRound = 0;
const guesses = 3;

function game() {
  console.log('render game');

  // check if there is an existing game state
  if (!window.app.host.game) {
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

function canUpdateRound() {
  return !!get(window, 'app.host.game.round.roundNumber');
}

function updateRound() {
  console.log('update round');

  const { hider, seeker, roundNumber, guesses } =
    get(window, 'app.host.game.round') || {};
  console.log('hider:', hider);
  console.log('seeker:', seeker);
  console.log('roundNumber:', roundNumber);
  console.log('guesses:', guesses);

  const { playerList } = get(window, `app.host`) || {};
  console.log('playerList:', playerList);

  $broadcast.innerHTML = `<div>Round ${roundNumber}</div>`;
  $narrative.innerHTML = `<div>${playerList[seeker].playerName}<div><div>is seeking</div><div>${playerList[hider].playerName}'s treasure</div>`;
  displayGrid(getGridArrayFromPlayer(hider));

  if (!guesses) {
    console.log('Out of guesses, rotate to next player');
    rotateRound();
  }
}

async function rotateRound() {
  const { round, players } = get(window, 'app.host.game') || {};

  let seekers = round.seekers.split(',');
  if (seekers.length === 1) {
    seekers = shuffle(Object.keys(players));
  } else {
    seekers.shift();
  }
  const seeker = seekers[0];

  const totalPlayers = Object.keys(players).length;

  // rotate hider
  const remainingBoards = getRemainingBoards().filter(
    (board) => board !== seeker
  );

  if (!remainingBoards.length) {
    console.log('we have a winner');
    return;
  }
  if (totalPlayers > 2 && remainingBoards.length === 1) {
    console.log('we have a winner');
    return;
  }

  const hider = shuffle(remainingBoards)[0];

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

function getGridArrayFromPlayer(player) {
  console.log('getGridArrayFromPlayer', player);
  const grid = getDefaultGridArray();
  const { indexes, guesses } =
    get(window, `app.host.game.players.${player}`) || {};

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
  if (!app.host.game) {
    return false;
  }
  return (
    Object.keys(app.host.playerList).length ===
    Object.keys(app.host.game.players).length
  );
}

async function startRound() {
  console.log('start round');

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
  const { players } = get(window, 'app.host.game') || {};
  return shuffle(Object.keys(players));
}

function getRoundNumber() {
  return get(window, 'app.host.game.round.roundNumber') || 1;
}

function getRemainingBoards() {
  const { players } = get(window, 'app.host.game') || {};
  const remainingBoards = [];

  for (const player in players) {
    const { guesses = '', indexes = '' } = players[player];
    const _guesses = guesses.split(',');
    const _indexes = indexes.split(',');
    const intersection = _indexes.filter((item) => _guesses.includes(item));
    // if there is treasure to be found
    if (intersection.length < 3) {
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
  const { playerList } = app.host;
  console.log('update player list', playerList);
  const treasureMarkup = '<div class="treasure"></div>';

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } =
        get(app, `host.playerList.${player}`) || 'undefined';
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
