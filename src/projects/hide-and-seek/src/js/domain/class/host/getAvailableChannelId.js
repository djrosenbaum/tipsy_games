import { getRef } from '../../../library/getRef';
import { getNewChannelId } from '../../../library/channel';

export async function getAvailableChannelId() {
  const ref = getRef('channel');

  let channelId = '';

  // get the first available room
  channelId = await ref
    .limitToFirst(10)
    .orderByChild('timestamp')
    .endAt(Date.now() - 60 * 60 * 1000)
    .once('value')
    .then((snapshot) => {
      console.log('snapshot:', snapshot);
      console.log('snapshot key:', snapshot.key);
      console.log('snapshot val:', snapshot.val());
      const val = snapshot.val() || {};
      return Object.keys(val)[0] || '';
    });

  console.log('first query channel id:', channelId);

  // if no room available get the last channel id created
  if (!channelId) {
    channelId = await ref
      .limitToLast(1)
      .orderByKey()
      .once('value')
      .then((snapshot) => {
        // console.log('snapshot:', snapshot);
        // console.log('snapshot key:', snapshot.key);
        // console.log('snapshot val:', snapshot.val());
        const val = snapshot.val() || {};
        const lastChannelCreated = Object.keys(val)[0] || '';
        return getNewChannelId(lastChannelCreated);
      });
    console.log('second query channel id:', channelId);
  }

  console.log('query channel id:', channelId);

  return channelId || 'abc';
}
