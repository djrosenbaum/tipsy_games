import { app } from '../app';
import { get } from 'lodash-es';

async function commit() {
  console.log('commit treasure');
  if (app.store.isBusy) {
    return;
  }

  const { myTreasure } = get(app, 'store.game.state.local') || {};
  const uid = window.firebase.auth().getUid();
  const gameRef = app.store.game.ref;
  const messageRef = gameRef.child(`players/messages/o/${uid}`);

  app.store.isBusy = true;

  messageRef.push({
    type: 'hide',
    payload: JSON.stringify({
      myTreasure,
    }),
  });

  return;

  const $broadcast = document.querySelector(
    '[data-screen="game"] .game-info .broadcast'
  );
  $broadcast.innerHTML = 'Your treasure is hidden';

  const $treasureWrapper = document.querySelector(
    '[data-screen="game"] .treasure-wrapper'
  );
  $treasureWrapper.classList.add('hide');

  const $commitWrapper = document.querySelector(
    '[data-screen="game"] .commit-wrapper'
  );
  $commitWrapper.classList.add('hide');

  const indexes = getIndexes();
  console.log('indexes', indexes);

  const ref = getRef();
  const { playerKey } = app;

  // set indexes
  await ref
    .child(`game/players/${playerKey}`)
    .update({
      indexes,
      treasure: 3,
    })
    .then(() => {
      console.log('indexes are set:', indexes);
      canCommit = true;
    });
}

// function canCommit() {
// const $commitWrapper = document.querySelector('[data-screen="game"] .commit-wrapper');
// if ($commitWrapper.classList.contains('hide')) {
//   return false;
// }
// $commitWrapper.addClass('hide');
// return true;
// }

export { commit };
