export function getActivePlayers(players) {
  console.log('get active players');
  return Object.keys(players).reduce((acc, val) => {
    console.log('val:', val);
    if (players[val].status) {
      acc[val] = players[val];
    }
    return acc;
  }, {});
}
