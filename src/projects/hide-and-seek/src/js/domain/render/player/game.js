import { app } from '../../app';
import { get } from 'lodash-es';
import {
  canUpdateRound,
  displayGrid,
  getDefaultGridArray,
  getGridArrayFromPlayer,
  renderScoreboard,
} from '../shared';
import { renderInfoboard, renderCrates } from './game/index.js';
import { renderNarrative } from '../shared/game/renderNarrative';
import { displayScreen } from '../../../library/displayScreen';

function game() {
  console.log('render game');
  console.log('render game');
  renderInfoboard();
  renderNarrative();
  renderCrates();
  renderScoreboard();

  displayScreen('game');
}

function updateRound() {
  console.log('update round');

  const { hider, seeker } = get(app, 'game.round') || {};
  console.log('hider:', hider);
  console.log('seeker:', seeker);

  const { playerList } = app || {};
  console.log('playerList:', playerList);

  app.dom.$broadcast.innerHTML = `<div>${playerList[seeker].playerName} is seeking</div>`;
  app.dom.$narrative.innerHTML = `<div>${playerList[hider].playerName} has treasure hidden here</div>`;
  displayGrid(getGridArrayFromPlayer(hider));
}

function renderEndGame() {
  console.log('render end game');
  app.dom.$broadcast.classList.add('hide');
  app.dom.$narrative.innerHTML = 'tally up your treasure';
}

async function newGame() {
  document.querySelector('[data-screen="game"]').innerHTML = app.initial_markup;

  const dom = {};
  app.dom = dom;

  dom.$crates = document.querySelector('[data-screen="game"] .crates');
  dom.$broadcast = document.querySelector('[data-screen="game"] .broadcast');
  dom.$narrative = document.querySelector('[data-screen="game"] .narrative');
  dom.$treasureWrapper = document.querySelector(
    '[data-screen="game"] .treasure-wrapper'
  );
  dom.$broadcast.innerHTML = 'Select crates to hide your treasure';
  dom.$treasureWrapper.innerHTML =
    '<div class="treasure"></div><div class="treasure"></div><div class="treasure"></div>';

  displayGrid(getDefaultGridArray());
}

export { game };
