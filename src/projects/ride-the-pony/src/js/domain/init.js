import { EventListener } from './class/event-listener';
import { app } from './app';

function init() {
  app.eventListener = new EventListener();
};

export {
  init
}