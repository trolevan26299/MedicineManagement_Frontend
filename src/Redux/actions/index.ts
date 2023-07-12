export const controlLoading = (status: boolean) => {
  return {
    type: 'CONTROL_LOADING',
    status: status,
  };
};
