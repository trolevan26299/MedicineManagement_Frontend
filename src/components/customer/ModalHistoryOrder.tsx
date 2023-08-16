import { useState, useEffect } from 'react';
import DataTable from '../common/DataTable';
import moment from 'moment';
import { IDetailOrder } from '../order/OrderHistoryList';
import { formatCurrency } from '../../constant/common';
import { requestApi } from '../../helpers/api';

function ModalHistoryOrder({ id }: { id: number }) {
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [data, setData] = useState();

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
      name: 'DETAILS',
      element: (row: any) =>
        row?.details?.length > 0 &&
        row?.details.map((item: IDetailOrder, index: number) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div style={{ width: '100%' }}>
              {index + 1}: {item?.post?.title}, Quantity : {item?.count}
            </div>
          );
        }),
    },
    {
      name: 'TOTAL PRICE',
      element: (row: any) => formatCurrency(row.total_price),
    },
  ];

  const fetchCustomerOrderById = (id: number) => {
    const query = `?items_per_page=${itemsPerPage}&page=${currentPage}`;
    requestApi(`/customer/order/${id}/${query}`, 'GET', [])
      .then((response) => {
        setData(response.data.data);
        setNumOfPage(response.data.lastPage);
        setCurrentPage(response.data.currentPage);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchCustomerOrderById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, id]);
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
