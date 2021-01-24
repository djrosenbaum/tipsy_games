import { render } from '../../render';
import { app } from '../../app';
import { set } from 'lodash-es';

export function onPlayerUpdate(snapshot) {
  console.log('on player update', snapshot);
  if (!snapshot.exists()) {
    console.log('snapshot does not exist', snapshot.exists());
    return;
  }
  console.log('snapshot does exist', snapshot.exists());
  app.game = snapshot.toJSON() || {};

  // render({
  //   playerType: 'host',
  //   screen: 'game',
  // });
}
