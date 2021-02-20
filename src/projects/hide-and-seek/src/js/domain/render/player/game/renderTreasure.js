import { app } from '../../../app';
import { get } from 'lodash-es';

export function renderTreasure() {
  const treasureMarkup = '<div class="treasure"></div>';
  const { state } = app.store.game;
  console.log('renderTreasure:', state);
  const $treasureWrapper = document.querySelector(
    '[data-screen="game"] .treasure-wrapper'
  );

  // New Game
  if (state.stage === 'intro') {
    const { startingTreasure } = get(app, 'store.game.config');
    const { myTreasure = [] } = get(app, 'store.game.state.local') || {};
    const remainingTreasure = startingTreasure - myTreasure.length;
    $treasureWrapper.innerHTML = treasureMarkup.repeat(remainingTreasure);
  }
}
