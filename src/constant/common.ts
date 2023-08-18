export const REQUEST_API_METHOD = {};

export const formatCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return formatter.format(amount);
};

export const PERMISSIONS = {
  ADMIN: 'admin',
  USER: 'user',
};

export interface ControlLoadingAction {
  type: 'CONTROL_LOADING';
  status: boolean;
}

export interface SetRoleAction {
  type: 'SET_ROLE';
  payload: string;
}

export type Action = ControlLoadingAction | SetRoleAction;
