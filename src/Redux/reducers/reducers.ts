import { combineReducers } from 'redux';
import globalLoading from './globalLoading';

const appReducers = combineReducers({
  globalLoading,
});
export default appReducers;
