const initialState = {
  status: false,
};

const globalLoading = (state = initialState, action: any) => {
  switch (action.type) {
    case 'CONTROL_LOADING':
      state = {
        status: action.status,
      };
      return state;

    default:
      return state;
  }
};
export default globalLoading;
