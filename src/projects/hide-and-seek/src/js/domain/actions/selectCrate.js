import { get } from 'lodash-es';
import { getRef } from '../../library/getRef';

let canGuess = true;

async function selectCrate(event) {
  const $broadcast = document.querySelector(
    '[data-screen="game"] .game-info .broadcast'
  );

  if ($broadcast.innerText === 'Select crates to hide your treasure') {
    hideTreasure(event);
  }

  const seeker = get(window, 'app.player.game.round.seeker') || '';
  const playerKey = get(window, 'app.player.playerKey') || '';
  if (seeker && seeker === playerKey) {
    guessCrate(event);
  }
}

async function guessCrate(event) {
  if (!canGuess) {
    false;
  }

  console.log('Guessing a crate', event);
  const $selectedCrate = event.target;
  const selectedIndex = $selectedCrate.dataset.index;
  const { hider, seeker } = get(window, 'app.player.game.round') || {};

  const _hider = get(window, `app.player.game.players.${hider}`) || {};
  const _seeker = get(window, `app.player.game.players.${seeker}`) || {};

  // const { indexes, guesses } = get(window, `app.player.game.players.${hider}`) || {};

  const guessArray = _hider.guesses ? _hider.guesses.split(',') : [];

  if (guessArray.includes(selectedIndex)) {
    console.log('crate already opened');
    return;
  }
  guessArray.push(selectedIndex);

  const ref = getRef();

  canGuess = false;

  let payload = {};
  payload[`game/players/${hider}/guesses`] = guessArray.join(',');

  console.log('indexes:', _hider.indexes);
  console.log('selectedIndex:', selectedIndex);
  if (_hider.indexes.split(',').includes(selectedIndex)) {
    console.log('a treasure was found');
    payload[`game/players/${hider}/treasure`] = _hider.treasure -= 1;
    payload[`game/players/${seeker}/treasure`] = _seeker.treasure += 1;
  }

  // set indexes
  await ref.update(payload).then(() => {
    console.log('guesses updated:', guessArray);
    canGuess = true;
  });
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
