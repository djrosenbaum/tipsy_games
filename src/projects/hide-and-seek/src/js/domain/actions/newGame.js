import { app } from '../app';
import { createNewHost } from '../class/Host';
import { firebaseConfig } from '../../domain/firebase/firebaseConfig';

async function newGame() {
  if (app.store.isBusy) {
    return;
  }
  app.store.isBusy = true;

  // initialize Firebase
  window.firebase.initializeApp(firebaseConfig);
  window.firebase
    .auth()
    .signInAnonymously()
    .then(createNewHost)
    .catch((error) => {
      console.error(error);
      app.store.isBusy = false;
    });
}

export { newGame };
