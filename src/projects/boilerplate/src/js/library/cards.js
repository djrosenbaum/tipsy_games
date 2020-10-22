import shuffle from './shuffle';

function Cards() {
  let cardPile = buildDeck();
  let discardPile = [];

  const config = {
    '0': 18,
    '1': 18,
    '2': 18,
    '3': 18,
    '4': 4,
  }

  function buildDeck() {
    const deck = Object.keys(config).reduce((accumulator, currentValue) => {
      for (let i = 0; i < config[currentValue]; i++) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    return shuffle(deck);
  }

  function discard(cardArray) {
    discardPile.concat(cardArray);
  }

  function draw(num) {
    const cardArray = [];
    for(let i=0; i<num; i++) {
      if (!cardPile.length) {
        cardPile = shuffle(discardPile);
        discardPile = [];
      }
      cardArray.push(cardPile.pop());
    }
    return cardArray;
  }

  this.discard = discard;
  this.draw = draw;
}

export default Cards;