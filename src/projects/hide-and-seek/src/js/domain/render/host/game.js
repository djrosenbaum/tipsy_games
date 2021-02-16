import { app } from '../../app';
import { get, remove, set, shuffle, intersection } from 'lodash-es';
import { getRef } from '../../../library/getRef';
import { hasTreasure } from './hasTreasure';
import {
  canUpdateRound,
  displayGrid,
  getDefaultGridArray,
  getGridArrayFromPlayer,
  updatePlayerList,
} from '../shared';
import {
  renderInfoboard,
  renderCrates,
  renderNarrative,
} from './game/index.js';
import { displayScreen } from '../../../library/displayScreen';

function game() {
  console.log('render game');
  renderInfoboard();
  renderNarrative();
  renderCrates();
  renderScoreboard();

  displayScreen('game');

  return;
}

function renderEndGame() {
  console.log('render end game');
  const { dom } = app;
  // hide the crates
  dom.$broadcast.innerHTML = 'tally up your treasure';
  dom.$narrative.classList.add('hide');
  dom.$playAgain.classList.remove('hide');
}

function updateRound() {
  console.log('update round');

  if (!hasTreasure()) {
    console.log('no treasure');
    endTurn();
    return;
  }

  const { hider, seeker, guesses } = get(app, 'game.round') || {};
  console.log('hider:', hider);
  console.log('seeker:', seeker);
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
  console.log('remaining boards:', remainingBoards);

  let hiders = get(app, 'local.hiders') || [];
  remove(hiders, (item) => item === seeker);
  if (hiders.length < 1) {
    console.log('no hiders found');
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
  console.log('filtered boards: ', filteredBoards);

  const hider = shuffle(filteredBoards)[0];
  remove(hiders, (item) => item === hider);

  const _round = {
    guesses: 3,
    hider,
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

function isReadyToStartRound() {
  if (!app.game) {
    return false;
  }
  const totalPlayersOnList = Object.keys(app.playerList).length;
  const totalPlayersInGame = Object.keys(app.game.players).length;
  return totalPlayersOnList === totalPlayersInGame;
}

async function startRound() {
  console.log('START ROUND');

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

export { game };
