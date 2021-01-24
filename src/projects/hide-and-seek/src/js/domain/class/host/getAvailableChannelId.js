import { getRef } from '../../../library/getRef';

export async function getAvailableChannelId() {
  const ref = getRef('channel');

  const channelId = await ref
    .limitToFirst(1)
    .orderByChild('reserved')
    .equalTo(false)
    .once('value')
    .then((snapshot) => {
      // console.log('snapshot:', snapshot);
      // console.log('snapshot key:', snapshot.key);
      // console.log('snapshot val:', snapshot.val());
      const val = snapshot.val() || {};
      return Object.keys(val)[0] || '';
    });

  return channelId;
}
