import { displayLog } from '../library/log';

export const app = {
  displayLog,
  store: {
    isBusy: false,
    game: {
      config: {
        name: 'hide_and_seek',
        minimumPlayers: 1,
      },
      state: {},
      players: {},
    },
  },
};
