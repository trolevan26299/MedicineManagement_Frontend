import React, { useState } from 'react';
import { IHistoryOrder } from './CustomerList';
import DataTable from '../common/DataTable';
import moment from 'moment';
import { IDetailOrder } from '../order/OrderHistoryList';
import { formatCurrency } from '../../constant/common';

function ModalHistoryOrder({ data }: { data: IHistoryOrder[] }) {
  console.log('🚀 ~ file: ModalHistoryOrder.tsx:6 ~ ModalHistoryOrder ~ data:', data);
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState([]);

  const columnsTable = [
    {
      name: 'ID',
      element: (row: any) => row.id,
    },
    {
      name: 'DATE',
      element: (row: any) => moment(row.created_at).format('DD/MM/YYYY'),
    },
    {
      name: 'DESCRIPTION',
      element: (row: any) => row.description,
    },
    {
      name: 'PRODUCT',
      element: (row: any) =>
        row?.details?.length > 0 &&
        row?.details.map((item: IDetailOrder, index: number) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div style={{ width: '100%' }}>
              {index + 1}: {item.post?.title}, Quantity : {item.post?.quantity}
            </div>
          );
        }),
    },
    {
      name: 'TOTAL PRICE',
      element: (row: any) => formatCurrency(row.total_price),
    },
  ];
  return (
    <div>
      <DataTable
        data={data}
        columns={columnsTable}
        title="List History Order"
        numOfPage={numOfPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onChangeItemPerPage={setItemPerPage}
        onChangeKeyword={() => {
          // todo
        }}
        itemsPerPage={itemsPerPage}
        onSelectedRows={(rows: any) => {
          console.log('selected rows in user list', rows);
        }}
      />
    </div>
  );
}

export default ModalHistoryOrder;
