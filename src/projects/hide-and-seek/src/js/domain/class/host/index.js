import { app } from '../../app';
import { getAvailableChannelId } from './getAvailableChannelId';
import { getRef } from '../../../library/getRef';
import { onGameUpdate } from './onGameUpdate';
import { onNewPlayer } from '../shared/onNewPlayer';
import { onPlayerStatusChange } from '../shared/onPlayerStatusChange';
import { onNewMessage } from './onNewMessage';

/**
 * Creates a new host, reserves a room, and sets up a new game
 */
async function createNewHost() {
  console.log('createNewHost');
  const { game } = app.store;
  game.playerType = 'host';

  const channelId = await getAvailableChannelId();
  console.log('channel id', channelId);

  if (!channelId) {
    console.error('something went wrong getting a new channel id');
    return;
  }
  game.channelId = channelId;

  const channelRef = getRef(`channel/${channelId}`);

  // get the user id
  const uid = firebase.auth().getUid();
  console.log('uid:', uid);

  const timestamp = firebase.database.ServerValue.TIMESTAMP;
  console.log('timestamp:', timestamp);

  await channelRef
    .update({
      uid,
      timestamp,
    })
    .then(() => {
      console.log('channel reserved');
      // remove player from the DOM
      document.querySelector('[data-group="player"]').remove();
      const gameRef = getRef(`games/${channelId}`);
      game.ref = gameRef;

      // to do handle host on disconnect
      // gameRef.onDisconnect().remove();

      gameRef.set({
        can_join: true,
      });
      gameRef.child('public').push({
        type: 'screen',
        payload: JSON.stringify({
          screen: 'lobby',
        }),
      });
      gameRef.child('public').on('child_added', onGameUpdate);
      gameRef.child('players/register').on('child_added', onNewPlayer);
      gameRef
        .child('players/register')
        .on('child_changed', onPlayerStatusChange);
      gameRef.child('players/messages/o').on('child_added', onNewMessage);
    });

  app.store.isBusy = false;
}

export { createNewHost };
