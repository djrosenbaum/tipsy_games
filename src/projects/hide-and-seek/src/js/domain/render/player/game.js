import { app } from '../../app';
import { get } from 'lodash-es';
// import { getRef } from '../../../library/getRef';

// store the initial html markup, allows for an easy game reset
let initial_markup = '';
let $crates;
let $broadcast;
let $narrative;
let $treasureWrapper;
// let currentRound = 0;

const game = () => {
  console.log('render game');

  const { state } = get(window, 'app.player.game.round') || '';

  if (state === 'winner') {
    renderEndGame();
    return;
  }

  // check if there is an existing game state
  if (!window.app.player.game) {
    if (!initial_markup) {
      initial_markup = document.querySelector('[data-screen="game"]').innerHTML;
    }
    newGame();
  }
  updatePlayerList();
  if (canUpdateRound()) {
    console.log('update round');
    updateRound();
  }
};

function updateRound() {
  console.log('update round');

  const { hider, seeker, roundNumber } =
    get(window, 'app.player.game.round') || {};
  console.log('hider:', hider);
  console.log('seeker:', seeker);
  console.log('roundNumber:', roundNumber);

  const { playerList } = get(window, `app.player`) || {};
  console.log('playerList:', playerList);

  $broadcast.innerHTML = `<div>${playerList[seeker].playerName} is seeking</div>`;
  $narrative.innerHTML = `<div>${playerList[hider].playerName} has treasure hidden here</div>`;
  displayGrid(getGridArrayFromPlayer(hider));
}

function renderEndGame() {
  console.log('render end game');
  // hide the crates
}

function canUpdateRound() {
  return !!get(window, 'app.player.game.round.roundNumber');
}

function newGame() {
  console.log('new game');

  document.querySelector('[data-screen="game"]').innerHTML = initial_markup;

  $crates = document.querySelector('[data-screen="game"] .crates');
  $broadcast = document.querySelector('[data-screen="game"] .broadcast');
  $narrative = document.querySelector('[data-screen="game"] .narrative');
  $treasureWrapper = document.querySelector(
    '[data-screen="game"] .treasure-wrapper'
  );

  $broadcast.innerHTML = 'Select crates to hide your treasure';

  $treasureWrapper.innerHTML =
    '<div class="treasure"></div><div class="treasure"></div><div class="treasure"></div>';
  displayGrid(getDefaultGridArray());
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

function getDefaultGridArray() {
  let gridArray = [];
  gridArray.length = 25;
  gridArray.fill(0);
  return gridArray;
}

function getGridArrayFromPlayer(player) {
  console.log('getGridArrayFromPlayer', player);
  const grid = getDefaultGridArray();
  const { indexes, guesses } =
    get(window, `app.player.game.players.${player}`) || {};

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

function updatePlayerList() {
  console.log('updatePlayerList');
  const { playerList } = app.player;
  console.log('update player list', playerList);
  const treasureMarkup = '<div class="treasure"></div>';

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } =
        get(app, `player.playerList.${player}`) || 'undefined';
      const { treasure } = get(app, `player.game.players.${player}`) || 0;

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
