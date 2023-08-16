import React from 'react';
import { IHistoryOrder } from './CustomerList';

function CustomerHistoryOrder({ data }: { data: IHistoryOrder }) {
  console.log('🚀 ~ file: CustomerHistoryOrder.tsx:5 ~ CustomerHistoryOrder ~ data:', data);
  return <div>History Order</div>;
}

export default CustomerHistoryOrder;
