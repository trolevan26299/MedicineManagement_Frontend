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
  SUPERADMIN: 'superadmin',
};

export interface ControlLoadingAction {
  type: 'CONTROL_LOADING';
  status: boolean;
}

export interface SetRoleAction {
  type: 'SET_ROLE';
  payload: string;
}
export interface UserInfo {
  type: 'INFO_USER';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export type Action = ControlLoadingAction | SetRoleAction | UserInfo;
