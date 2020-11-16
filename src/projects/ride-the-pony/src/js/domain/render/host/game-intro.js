import { app } from '../../app';
import { getRef } from '../../../library/get-ref';

let initial_markup = '';
let can_start_new_game = true;
let first_run = true;

function gameIntro() {
  console.log('render game intro');

  if (first_run) {
    first_run = false;
    initial_markup = document.querySelector('[data-screen="game_intro"]').innerHTML;
  }

  newGame();
}

function newGame() {
  if (!can_start_new_game) {
    return;
  }
  can_start_new_game = false;
  document.querySelector('[data-screen="game_intro"]').innerHTML = initial_markup;
  updatePlayerList();
  startCountdown();
}

async function startCountdown() {
  // set start time
  const startTime = Math.floor(Date.now() / 1000) + 10;

  // get reference to firebase
  const ref = getRef();

  // send message to firebase with the timestamp
  await ref.update({
    race_time: startTime,
  }).then(() => {
    countdown(startTime);
  });
}

function countdown(startTime) {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeTilStart = startTime - currentTime;

  if (timeTilStart <= 0) {
    startRace();
    return;
  }

  document.querySelector('[data-screen="game_intro"] .countdown').innerHTML = timeTilStart;

  setTimeout(() => {
    countdown(startTime);
  }, 1000);
}

function startRace() {
  console.log('start race!!');
  document.querySelector('[data-screen="game_intro"] .countdown').classList.add('hide');
  document.querySelector('[data-screen="game_intro"] .leader').classList.remove('hide');
  document.querySelector('[data-screen="game_intro"] .tracks').classList.add('hot');

  const outcome = getOutcome();
  moveHorses(outcome);
}

function moveHorses(outcome) {
  console.log('move horses:', outcome);
  // const horses = document.querySelectorAll('[data-screen="game_intro"] .track .horse');
  let iteration = 0;
  const winner = getWinner(outcome);

  const interval = setInterval(() => {
    console.log('move horses', iteration);
    const frames = outcome.map(horse => horse.frame).sort((a, b) => a - b);

    console.log('frames:', frames);

    for (let i = 0; i < outcome.length; i++) {
      const { distances } = outcome[i];
      const horse = document.querySelector(`[data-screen="game_intro"] .track[data-key="${outcome[i].player}"] .horse`);
      console.log('distance', distances[iteration]);
      // last lap
      if (iteration >= frames[0]) {
        moveHorse(horse, 40);
      } else {
        moveHorse(horse, distances[iteration]);
      }
    }

    if (iteration >= frames[0] + 1) {
      clearInterval(interval);
      setTimeout(() => {
        document.querySelector('[data-screen="game_intro"] .tracks').classList.remove('hot');
        document.querySelector('[data-screen="game_intro"] .race-again').classList.remove('hide');
        document.querySelector('[data-screen="game_intro"] .leader').innerHTML = `winner: ${winner}`;
        can_start_new_game = true;
      }, 1000);
    }
    iteration += 1;
  }, 1000);
}

function moveHorse(horse, distance) {
  console.log('move horse:', horse, distance);
  horse.style.marginLeft = `${parseInt(horse.style.marginLeft, 10) + distance}px`;
}

function getWinner(outcome) {
  // sort by frame finished
  const step1 = outcome.sort((a, b) => a.frame - b.frame);
  
  // only keep the lowest frame
  const step2 = step1.filter(a => a.frame === step1[0].frame);

  // sort by how many steps were taken in the last frame
  const step3 = step2.sort((a, b) => a.steps - b.steps);

  const winner = step3[0];

  console.log('==== GET WINNER ', winner);
  const { playerName } = window.app.host.playerList[winner.player];
  console.log('==== PLAYER NAME ', playerName);
  return playerName;
}

function updatePlayerList() {
  const { playerList } = app.host;
  console.log('update player list', playerList);

  let markup = Object.keys(playerList).map(player => {
    const { playerName, hue } = playerList[player];
    return `<div class="track" data-key=${player}><div class="horse" style="margin-left: -100px; filter: hue-rotate(${hue}deg)"></div><div class="player-name">${ playerName }</div></div>`;
  }).join('');

  const track = document.querySelector('[data-screen="game_intro"] .tracks');
  track.innerHTML = markup;
}

function getOutcome() {
  const { playerList } = app.host;

  return Object.keys(playerList).map(player => {
    let distances = [];
    let totalDistance = 0;
    let frame = 0;
    let steps = 0;

    // keep looping until the horse reaches the minimum
    for(let i = 0; i < 100; i++) {
      const distance = getRandomDistance(30, 40);
      
      if (totalDistance + distance >= 960) {
        frame = i;
        steps = 960 - totalDistance;
        break;
      }

      distances.push(distance);
      totalDistance += distance;
    }

    return {
      distances,
      frame,
      player,
      steps,
    };
  });
}

// // min and max included
function getRandomDistance(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;  
}

export {
  gameIntro,
  newGame,
}