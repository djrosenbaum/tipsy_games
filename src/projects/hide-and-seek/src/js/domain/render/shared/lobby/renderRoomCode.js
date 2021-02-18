import { app } from '../../../app';

export function renderRoomCode() {
  document.querySelector('[data-screen="lobby"] .room-code').innerText =
    app.store.game.channelId;
}
