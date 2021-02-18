import { app } from '../../../app';
import {
  displayGrid,
  getDefaultGridArray,
  getGridArrayFromPlayer,
} from '../../shared';

export function renderCrates() {
  const { state } = app.store.game;
  console.log('renderCrates:', state);
  const $crates = document.querySelector('[data-screen="game"] .crates');

  // New Game
  if (state.stage === 'intro') {
    displayGrid(getDefaultGridArray(), $crates);
  }
}
