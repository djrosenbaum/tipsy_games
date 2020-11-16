import { render } from '../../render';

function onScreenUpdated(snapshot) {
  console.log('on screen updated', snapshot);
  const screen = snapshot.exists() ? snapshot.toJSON() : '';

  render({
    playerType: 'player',
    screen,
  });
}

export {
  onScreenUpdated,
}