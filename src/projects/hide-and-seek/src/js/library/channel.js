/**
 * Converts a number to letters
 *
 * @param { Number } num - some number
 * @returns { string } - a string representing the number. for example 123 will return "DT"
 */
function numberToLetters(num) {
  const alphabet = 'bcdfghjkmnpqrstvwxz';
  const base = alphabet.length;
  let letters = '';
  while (num >= 0) {
    letters = alphabet[num % base] + letters;
    num = Math.floor(num / base) - 1;
  }
  return letters;
}

/**
 * Convert letters to a number
 *
 * @param { string } letters - some letters
 * @returns { Number } - a number representing the letters. for example "DT" will return 123
 */
function lettersToNumber(letters) {
  const alphabet = 'bcdfghjkmnpqrstvwxz';
  const base = alphabet.length;
  let num = 0;

  letters
    .split('')
    .reverse()
    .forEach((letter, index) => {
      const letterIndex = alphabet.indexOf(letter);
      if (index === 0) {
        num += letterIndex;
      } else {
        num += Math.pow(base, index) * (letterIndex + 1);
      }
    });
  return num;
}

/**
 *
 * @param {string} latestChannelId - some channel id
 */
export function getNewChannelId(latestChannelId) {
  if (!latestChannelId) {
    return numberToLetters(1000);
  }
  // increment channel number
  const newChannelNumber = lettersToNumber(latestChannelId) + 1;
  return numberToLetters(newChannelNumber);
}
