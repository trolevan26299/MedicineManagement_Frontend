import { PERMISSIONS, Action } from '../../constant/common';

export interface RootState {
  status: boolean;
  role: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any;
}

const initialState: RootState = {
  status: false,
  role: PERMISSIONS.USER,
  info: {},
};

const globalLoading = (state = initialState, action: Action): RootState => {
  switch (action.type) {
    case 'CONTROL_LOADING':
      return { ...state, status: action.status };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'INFO_USER':
      return { ...state, info: action.payload };
    default:
      return state;
  }
};
export default globalLoading;
