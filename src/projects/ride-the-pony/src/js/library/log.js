const record = [];

export const log = (message) => {
  record.push(message);
}

export const displayLog = () => {
  window.console.log(record.join('\n'));
}