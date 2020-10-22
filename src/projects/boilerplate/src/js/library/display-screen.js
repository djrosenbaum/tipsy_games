function displayScreen(screen) {
  console.log('display screen', screen);
  document.querySelectorAll('[data-screen]').forEach(item => {
    item.classList.add('hidden');
  });
  document.querySelector(`[data-screen="${screen}"]`).classList.remove('hidden');
}

export {
  displayScreen,
}