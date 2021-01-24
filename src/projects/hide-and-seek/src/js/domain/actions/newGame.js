import { createNewHost } from '../class/Host';
import { firebaseConfig } from '../../domain/firebase/firebaseConfig';

let canCreateNewGame = true;

async function newGame() {
  if (!canCreateNewGame) {
    return;
  }
  canCreateNewGame = false;

  // remove player from the DOM
  document.querySelector('[data-group="player"]').remove();

  // initialize Firebase
  window.firebase.initializeApp(firebaseConfig);
  window.firebase
    .auth()
    .signInAnonymously()
    .then(createNewHost)
    .catch((error) => {
      console.error(error);
    });
}

export { newGame };
