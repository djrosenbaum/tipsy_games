// import { getRef } from '../../library/getRef';

async function selectCrate(event) {
  const $broadcast = document.querySelector(
    '[data-screen="game"] .game-info .broadcast'
  );

  if ($broadcast.innerText === 'Select crates to hide your treasure') {
    hideTreasure(event);
  }

  if ($broadcast.innerText === 'You are seeking treasure') {
    console.log('seeking treasure');
  }
}

function hideTreasure(event) {
  console.log('hiding a treasure');
  const $selectedCrate = event.target;
  const $treasureWrapper = document.querySelector(
    '[data-screen="game"] .treasure-wrapper'
  );
  const $commitWrapper = document.querySelector(
    '[data-screen="game"] .commit-wrapper'
  );

  const isCrateSelected = $selectedCrate.classList.contains('selected');
  // check if the crate is already selected
  if (isCrateSelected) {
    // unselect the crate and add treasure
    $selectedCrate.classList.remove('selected');
    $treasureWrapper.insertAdjacentHTML(
      'beforeend',
      '<div class="treasure"></div>'
    );
    $commitWrapper.classList.add('hide');
    return;
  }

  const $treasures = document.querySelectorAll(
    '[data-screen="game"] .treasure-wrapper .treasure'
  );
  if (!$treasures.length) {
    // return if there are no treasures
    return;
  }
  if ($treasures.length === 1) {
    // show commit button
    $commitWrapper.classList.remove('hide');
  }

  $selectedCrate.classList.add('selected');
  $treasureWrapper.removeChild($treasureWrapper.lastChild);
}

export { selectCrate };
