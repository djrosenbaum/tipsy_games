import { app } from '../../app';
import { getAvailableChannelId } from './getAvailableChannelId';
import { getRef } from '../../../library/getRef';
import { onGameUpdate } from './onGameUpdate';
import { onPlayerUpdate } from './onPlayerUpdate';
import { set } from 'lodash-es';

/**
 * Creates a new host, reserves a room, and sets up a new game
 */
async function createNewHost() {
  console.log('createNewHost');
  const { game } = app.store;
  game.playerType = 'host';

  // first channel id where reserved == false
  const channelId = await getAvailableChannelId();
  console.log('channel id', channelId);

  if (!channelId) {
    console.error('all channels full or something went wrong');
    return;
  }
  game.channelId = channelId;

  const channelRef = getRef(`channel/${channelId}`);
  await channelRef.onDisconnect().set({
    reserved: false,
  });

  // get the user id
  const uid = firebase.auth().getUid();
  console.log('uid:', uid);

  const timestamp = firebase.database.ServerValue.TIMESTAMP;
  console.log('timestamp:', timestamp);

  channelRef
    .update({
      reserved: true,
      uid,
      timestamp,
    })
    .then(() => {
      console.log('channel reserved');
      // remove player from the DOM
      document.querySelector('[data-group="player"]').remove();
      const gameRef = getRef(`games/${channelId}`);
      set(app, 'store.game.ref', gameRef);
      gameRef.onDisconnect().remove();
      gameRef.set({
        can_join: true,
      });
      gameRef.child('public').push({
        payload: JSON.stringify({
          screen: 'lobby',
        }),
      });
      gameRef.child('public').on('child_added', onGameUpdate);
      gameRef.child('private').on('child_added', onPlayerUpdate);
    });
}

export { createNewHost };
