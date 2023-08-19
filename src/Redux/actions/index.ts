export const controlLoading = (status: boolean) => {
  return {
    type: 'CONTROL_LOADING',
    status: status,
  };
};

export const setRole = (role: string) => ({
  type: 'SET_ROLE',
  payload: role,
});

export const infoUser = (info: any) => ({
  type: 'INFO_USER',
  payload: info,
});
