function getRef() {
  const { host, player } = window.app;
  if (host && host.ref) {
    return host.ref;
  }
  if (player && player.ref) {
    return player.ref;
  }
}

export {
  getRef
}