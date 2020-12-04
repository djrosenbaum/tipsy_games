import { render } from '../../render';
import { log } from '../../../library/log';

const onScreenUpdated = (snapshot) => {
  log('on screen updated');
  const screen = snapshot.exists() ? snapshot.toJSON() : '';
  if (!screen) {
    return;
  }

  render({
    playerType: 'player',
    screen,
  });
};

export { onScreenUpdated };
