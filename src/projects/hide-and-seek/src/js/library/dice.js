export const diceMap = {
  1: '<div class="dice first-face"><span class="dot"></span></div>',
  2: '<div class="dice second-face"><span class="dot"></span><span class="dot"></span></div>',
  3: '<div class="dice third-face"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>',
  4: '<div class="fourth-face dice"><div class="column"><span class="dot"></span><span class="dot"></span></div><div class="column"><span class="dot"></span><span class="dot"></span></div></div>',
  5: '<div class="fifth-face dice"><div class="column"><span class="dot"></span><span class="dot"></span></div><div class="column"><span class="dot"></span></div><div class="column"><span class="dot"></span><span class="dot"></span></div></div>',
  6: '<div class="sixth-face dice"><div class="column"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="column"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>',
};

export function roll(sides) {
  return Math.floor(Math.random() * Math.floor(sides)) + 1;
}
