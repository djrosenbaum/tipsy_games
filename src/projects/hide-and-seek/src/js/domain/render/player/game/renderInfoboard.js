import { app } from '../../../app';

export function renderInfoboard() {
  const { state } = app.store.game;
  console.log('renderInfoboard:', state);
  const $broadcast = document.querySelector('[data-screen="game"] .broadcast');

  // New Game
  if (state.stage === 'intro') {
    $broadcast.innerHTML = 'Select crates to hide your treasure';
  }
}
