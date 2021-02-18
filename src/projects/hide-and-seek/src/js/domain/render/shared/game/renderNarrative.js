import { app } from '../../../app';

export function renderNarrative() {
  const { state } = app.store.game;
  console.log('renderNarrative:', state);
  // const $narrative = document.querySelector('[data-screen="game"] .narrative');

  // New Game
  if (state.stage === 'foo') {
    console.log('bar');
  }
}
