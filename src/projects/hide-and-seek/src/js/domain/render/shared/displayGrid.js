import { app } from '../../app';

export function displayGrid(gridArray) {
  let markup = gridArray
    .map((item, index) => {
      if (item === 0) {
        return `<div class="crate" data-action="selectCrate" data-index="${index}"></div>`;
      }
      if (item === 1) {
        return `<div class="crate open"></div>`;
      }
      if (item === 2) {
        return `<div class="treasure"></div>`;
      }
    })
    .join('');
  app.dom.$crates.innerHTML = `<div data-crates="default">${markup}</div>`;
}
