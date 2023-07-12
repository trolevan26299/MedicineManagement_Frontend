import { legacy_createStore as createStore } from 'redux';
import appReducers from './reducers/reducers';

const store = createStore(appReducers);
export default store;
