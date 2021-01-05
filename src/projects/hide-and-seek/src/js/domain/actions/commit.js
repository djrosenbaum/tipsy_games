import { getRef } from '../../library/getRef';

let canCommit = true;

async function commit() {
  console.log('commit treasure');
  if (!canCommit) {
    return;
  }
  canCommit = false;

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
  const { playerKey } = window.app.player;

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

function getIndexes() {
  const $selectedCrates = document.querySelectorAll('.crate.selected');
  const indexes = [];
  $selectedCrates.forEach((crate) => {
    indexes.push(crate.dataset.index);
  });
  return indexes.join(',');
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
