import app from '../app';

export default async function handleStartGame() {
  console.log('start game');

  app.room.update({
    screen: 'game',
  }).then(() => {
    console.log('show the game');
  });
}