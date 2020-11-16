import { getRef } from'../../library/getRef';

let canSelectPony = true;

async function selectPony(event) {
  if (!canSelectPony) {
    return;
  }
  const { hue } = event.target.dataset;
  canSelectPony = false;
  const ref = getRef();
  const { playerKey } = window.app.player;
  // set pony
  await ref.child('players').child(playerKey).update({
    hue,
  }).then(() => {
    console.log('hue is set:', hue);
    canSelectPony = true;
  });
}

export {
  selectPony,
}