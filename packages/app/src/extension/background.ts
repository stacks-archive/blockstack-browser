import { wrapStore } from 'webext-redux';
import { store } from '../store';
import { walletDeserializer } from '../store/ext-store';

wrapStore(store, {
  portName: 'ExPort', // Communication port between the background component and views such as browser tabs.
  deserializer: (payload: any) => JSON.parse(payload, walletDeserializer),
  serializer: (payload: any) => JSON.stringify(payload),
});
