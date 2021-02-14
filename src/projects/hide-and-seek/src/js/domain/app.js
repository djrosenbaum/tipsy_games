import { displayLog } from '../library/log';

export const app = {
  displayLog,
  store: {
    game: {
      name: 'hide_and_seek',
      minimumPlayers: 2,
      state: {},
      players: [],
    },
  },
};
