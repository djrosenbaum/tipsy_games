import { getRef } from './get-ref';
import { render } from '../domain/render';

async function setScreen(screen) {
  const ref = getRef();

  await ref.update({
    screen,
  }).then(() => {
    render({
      screen,
      playerType: 'host',
    });
  });
}

export {
  setScreen,
}