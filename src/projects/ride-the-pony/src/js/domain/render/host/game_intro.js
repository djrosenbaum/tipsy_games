import { app } from '../../app';
import { getRef } from '../../get-ref';

function game_intro() {
  console.log('render game intro');

  const { playerList } = app.host;

  updatePlayerList(playerList);
  startCountdown();

  console.log('beginning to render the game intro'); 
}

async function startCountdown() {
  // set start time
  const startTime = Math.floor(Date.now() / 1000) + 5;

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
  const horses = document.querySelectorAll('[data-screen="game_intro"] .track .horse');
  let iteration = 0;
  const winner = getWinner(outcome);

  const interval = setInterval(() => {
    console.log('move horses', iteration);
    const frames = outcome.map(horse => horse.frame).sort((a, b) => a - b);

    console.log('frames:', frames);

    for (let i = 0; i < horses.length; i++) {
      const { distances } = outcome[i];
      console.log('distance', distances[iteration]);
      // last lap
      if (iteration >= frames[0]) {
        moveHorse(horses[i], 40);
      } else {
        moveHorse(horses[i], distances[iteration]);
      }
    }

    if (iteration >= frames[0] + 1) {
      clearInterval(interval);
      setTimeout(() => {
        document.querySelector('[data-screen="game_intro"] .tracks').classList.remove('hot');
        document.querySelector('[data-screen="game_intro"] .leader').innerHTML = `winner: ${winner}`;
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
  const winner = outcome
    .sort((a, b) => a.frame - b.frame)
    .filter(a => a.frame === outcome[0].frame)
    .sort((a, b) => a.steps - b.steps);

    console.log('==== GET WINNER ', winner);
    const { playerName } = window.app.host.playerList[winner[0].player];
    console.log('==== PLAYER NAME ', winner);
    return playerName;
}

function updatePlayerList(playerList) {
  console.log('update player list', playerList);

  let markup = Object.keys(playerList).map(player => {
    const playerName = playerList[player].playerName;
    return `<div class="track"><div class="horse" style="margin-left: -100px"></div><div class="player-name">${ playerName }</div></div>`;
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
  game_intro
}