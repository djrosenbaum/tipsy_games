import { app } from '../../../app';

export function renderInfoboard() {
  const { state } = app.store.game;
  console.log('renderInfoboard:', state);
  const $broadcast = document.querySelector('[data-screen="game"] .broadcast');

  // New Game
  if (!state.stage) {
    $broadcast.innerHTML = 'Time to hide your treasure';
  }
}
