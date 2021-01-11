import { Store, applyMiddleware } from 'webext-redux';
import { middlewareComponents } from './';

export const getStore = () => {
  const store = new Store({
    portName: 'ExPort',
  });
  applyMiddleware(store, ...middlewareComponents);
  return store;
};

export default getStore;
