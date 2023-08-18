import { PERMISSIONS, Action } from '../../constant/common';

export interface RootState {
  status: boolean;
  role: string;
}

const initialState: RootState = {
  status: false,
  role: PERMISSIONS.USER,
};

const globalLoading = (state = initialState, action: Action): RootState => {
  switch (action.type) {
    case 'CONTROL_LOADING':
      return { ...state, status: action.status };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    default:
      return state;
  }
};
export default globalLoading;
