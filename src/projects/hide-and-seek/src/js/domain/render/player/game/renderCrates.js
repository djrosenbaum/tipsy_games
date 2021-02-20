import { app } from '../../../app';
import {
  displayGrid,
  getDefaultGridArray,
  getGridArrayFromPlayer,
} from '../../shared';
import { get } from 'lodash-es';

export function renderCrates() {
  const { state } = app.store.game;
  console.log('renderCrates:', state);
  const $crates = document.querySelector('[data-screen="game"] .crates');

  // New Game
  if (state.stage === 'intro') {
    displayGrid(getDefaultGridArray(), $crates);
    const { myTreasure = [] } = get(app, 'store.game.state.local') || {};

    // highlight selected treasure
    myTreasure.forEach((index) => {
      document
        .querySelector(`[data-screen="game"] .crate[data-index="${index}"]`)
        .classList.add('selected');
    });
  }
}
