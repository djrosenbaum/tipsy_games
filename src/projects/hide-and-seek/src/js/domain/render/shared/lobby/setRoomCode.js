import { app } from '../../../app';

export function setRoomCode() {
  document.querySelector('[data-screen="lobby"] .room-code').innerText =
    app.store.game.channelId;
}
