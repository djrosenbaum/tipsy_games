const game = () => {
  console.log('render game intro');

  let $crates = document.querySelector('[data-screen="game"] .crates');
  let $broadcast = document.querySelector('[data-screen="game"] .broadcast');
  let $treasureWrapper = document.querySelector(
    '[data-screen="game"] .treasure-wrapper'
  );

  function newGame() {
    $broadcast.innerHTML = 'Select crates to hide your treasure';
    $treasureWrapper.innerHTML =
      '<div class="treasure"></div><div class="treasure"></div><div class="treasure"></div>';
    displayGrid(getDefaultGridArray());
  }

  function displayGrid(gridArray) {
    let markup = gridArray
      .map((item, index) => {
        if (item === 0) {
          return `<div class="crate" data-action="selectCrate" data-index="${index}"></div>`;
        }
        if (item === 1) {
          return `<div class="crate open" data-action="selectCrate" data-index="${index}"></div>`;
        }
      })
      .join('');
    $crates.innerHTML = `<div data-crates="default">${markup}</div>`;
  }

  function getDefaultGridArray() {
    let gridArray = [];
    gridArray.length = 25;
    gridArray.fill(0);
    return gridArray;
  }

  newGame();
};

export { game };
