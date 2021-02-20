import { get, intersection, pull } from 'lodash-es';
import { getRef } from '../../library/getRef';
import { app } from '../app';
import { render } from '../render';

// let canGuess = true;

async function selectCrate(event) {
  console.log('selecting a crate:', event);

  const { state } = app.store.game;

  // New Game
  if (state.stage === 'intro') {
    state.local = state.local || {};
    state.local.myTreasure = state.local.myTreasure || [];

    hideTreasure(event);
  }

  // const seeker = get(app, 'game.round.seeker') || '';
  // const playerKey = app.playerKey || '';
  // if (seeker && seeker === playerKey) {
  //   guessCrate(event);
  // }
}

function hasTreasure() {
  console.log('hasTreasure()');
  const { hider } = get(app, 'game.round') || {};
  const { indexes, guesses = '' } = get(app, `game.players.${hider}`) || {};

  console.log('hider:', hider);
  console.log('indexes:', indexes);
  console.log('guesses:', guesses);

  const discoveredTreasure = intersection(
    indexes.split(','),
    guesses.split(',')
  );
  if (discoveredTreasure.length < 3) {
    console.log('has treasure');
    return true;
  }
  console.log('does not have treasure');
  return false;
}

async function guessCrate(event) {
  if (!canGuess) {
    false;
  }

  if (!hasTreasure()) {
    console.log('no treasure left');
    return;
  }

  const { round } = app.game || {};
  if (!round.guesses) {
    // no more guesses
    return;
  }

  console.log('Guessing a crate', event);
  const $selectedCrate = event.target;
  const selectedIndex = $selectedCrate.dataset.index;
  const { hider, seeker } = get(app, 'game.round') || {};

  const _hider = get(app, `game.players.${hider}`) || {};
  const _seeker = get(app, `game.players.${seeker}`) || {};

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
  payload[`game/round/guesses`] = round.guesses -= 1;

  console.log('indexes:', _hider.indexes);
  console.log('selectedIndex:', selectedIndex);
  if (_hider.indexes.split(',').includes(selectedIndex)) {
    console.log('a treasure was found');
    payload[`game/players/${hider}/treasure`] = _hider.treasure -= 1;
    payload[`game/players/${seeker}/treasure`] = _seeker.treasure += 1;
  }

  // set indexes
  await ref.update(payload).then(() => {
    console.log('guesses remaining', round.guesses);
    canGuess = true;
  });
}

function hideTreasure(event) {
  const { myTreasure } = app.store.game.state.local;

  console.log('hiding a treasure', myTreasure);

  const $selectedCrate = event.target;
  const selectedIndex = $selectedCrate.dataset.index;

  if (myTreasure.includes(selectedIndex)) {
    console.log('unselect treasure');
    pull(myTreasure, selectedIndex);
  } else {
    console.log('select treasure');
    myTreasure.push(selectedIndex);
  }

  render();

  // const isCrateSelected = $selectedCrate.classList.contains('selected');
  // // check if the crate is already selected
  // if (isCrateSelected) {
  //   // unselect the crate and add treasure
  //   $selectedCrate.classList.remove('selected');
  //   $treasureWrapper.insertAdjacentHTML(
  //     'beforeend',
  //     '<div class="treasure"></div>'
  //   );
  //   $commitWrapper.classList.add('hide');
  //   return;
  // }

  // const $treasures = document.querySelectorAll(
  //   '[data-screen="game"] .treasure-wrapper .treasure'
  // );
  // if (!$treasures.length) {
  //   // return if there are no treasures
  //   return;
  // }
  // if ($treasures.length === 1) {
  //   // show commit button
  //   $commitWrapper.classList.remove('hide');
  // }

  // $selectedCrate.classList.add('selected');
  // $treasureWrapper.removeChild($treasureWrapper.lastChild);
}

export { selectCrate };
