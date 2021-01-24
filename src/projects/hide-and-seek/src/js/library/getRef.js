function getRef(path) {
  return window.firebase.database().ref(path);
}

export { getRef };
