import { actions } from '../domain/actions';

function handleClick(event) {
  console.log('clicked:', event);
  const action = event.target.dataset.action || '';
  actions[action] && actions[action](event);
}

export { handleClick };
