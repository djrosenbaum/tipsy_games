const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function createRoomCode() {
  const roomCode = [];
  for(let i = 0; i < 4; i++) {
    roomCode[i] = getRandom(letters);
  }
  return roomCode.join('');
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export {
  createRoomCode,
}