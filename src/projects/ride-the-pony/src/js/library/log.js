const record = [];

export const log = () => {
  record.push(...arguments);
};

export const displayLog = () => {
  window.console.log(record.join('\n'));
};
