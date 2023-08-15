export const REQUEST_API_METHOD = {};

export const formatCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return formatter.format(amount);
};
