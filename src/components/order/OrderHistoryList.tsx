import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../Redux/actions';
import { PERMISSIONS, formatCurrency } from '../../constant/common';
import { requestApi } from '../../helpers/api';
import DataTable from '../common/DataTable';
import OrderAdd from './OrderAdd';
import { ICustomer } from '../customer/CustomerList';
import CommonModal from '../common/Modal';
import { RootState } from '../../Redux/reducers/globalLoading';

export interface IDetailOrder {
  count?: number;
  id?: number;
  order_id?: number;
  medicine_id?: number;
  medicine?: {
    created_at: string;
    description: string;
    id: number;
    price: number;
    price_sale: number;
    quantity: number;
    status: number;
    thumbnail: string;
    title: string;
    updated_at: string;
  };
}

export interface IOrder {
  id?: number;
  created_at?: string;
  customer?: ICustomer;
  description?: string;
  details?: IDetailOrder[];
  total_price?: number;
  updated_at?: string;
}

const CustomerList = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.globalLoading.role);
  const [orderList, setOrderList] = useState([]);
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState('single');
  const [showModal, setShowModal] = useState<{
    isShow: boolean;
    title: string;
    content?: string;
    isShowFooter: boolean;
    currentOrderById: IOrder | null;
  }>({
    isShow: false,
    title: '',
    isShowFooter: false,
    currentOrderById: null,
  });
  const [refresh, setRefresh] = useState(Date.now());

  const renderModalView = () => {
    return (
      <CommonModal
        show={showModal.isShow}
        onHide={() => setShowModal({ ...showModal, isShow: false, currentOrderById: null })}
        data={
          showModal.content ? (
            showModal.content
          ) : (
            <OrderAdd readonly={true} data={showModal.currentOrderById as IOrder} />
          )
        }
        onFnc={showModal.content ? requestDeleteApi : undefined}
        titleFooter={showModal.content ? 'Delete' : ''}
        size={showModal?.content ? 'sm' : 'lg'}
        title={showModal.title}
      />
    );
  };
  const columnsTable = [
    {
      name: 'ID Order',
      element: (row: any) => row?.id,
    },
    {
      name: 'Customer Name(ID)',
      element: (row: any) => `${row.customer?.full_name} (${row.customer?.id})`,
    },
    {
      name: 'Phone Number',
      element: (row: any) => row.customer?.phone_number,
    },
    {
      name: 'Buy Date',
      element: (row: any) => (row?.created_at ? moment(row?.created_at).format('DD/MM/YYYY') : ''),
    },
    {
      name: 'Total Price',
      element: (row: any) => formatCurrency(row?.total_price),
    },
    {
      name: 'pharmacist name',
      element: (row: any) => `${row?.users?.first_name || ''} ${row?.users?.last_name || ''}`,
    },
    {
      name: 'description',
      element: (row: any) => row?.description,
    },
    {
      name: 'Actions',
      element: (row: any) => (
        <>
          {(userRole === PERMISSIONS.ADMIN || userRole === PERMISSIONS.SUPERADMIN) && (
            <>
              <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(row.id)}>
                <i className="fa fa-trash" />
                &nbsp; Delete
              </button>
            </>
          )}
          <Link className="btn btn-sm btn-warning me-1" to={`/order/edit/${row.id}`}>
            <i className="fa fa-pencil-alt" />
            &nbsp; Edit
          </Link>
          <button type="button" className="btn btn-sm btn btn-info me-1" onClick={() => handleOpenViewModal(row.id)}>
            <i className="fa fa-eye" />
            &nbsp; View
          </button>
        </>
      ),
    },
  ];

  const handleOpenViewModal = (id: number) => {
    fetchOrderById(id);
  };

  const handleDelete = (id: any) => {
    setShowModal({
      ...showModal,
      title: 'Confirmation',
      content: 'Are yous sure want to delete ?',
      isShowFooter: true,
      isShow: true,
    });
    setDeleteItem(id);
    setDeleteType('single');
  };

  const handleMultiDelete = () => {
    setShowModal({
      ...showModal,
      title: 'Confirmation',
      content: 'Are yous sure want to delete ?',
      isShowFooter: true,
      isShow: true,
    });

    setDeleteType('multi');
  };

  const requestDeleteApi = () => {
    if (deleteType === 'single') {
      dispatch(actions.controlLoading(true));
      requestApi(`/order/${deleteItem}`, 'DELETE', [])
        .then(() => {
          setShowModal({ ...showModal, isShow: false });
          setRefresh(Date.now());
          dispatch(actions.controlLoading(false));
        })
        .catch((error) => {
          console.error(error);
          setShowModal({ ...showModal, isShow: false });
          dispatch(actions.controlLoading(false));
        });
    } else {
      dispatch(actions.controlLoading(true));
      requestApi(`/order/multiple?ids=${selectedRows.toString()}`, 'DELETE', [])
        .then(() => {
          setShowModal({ ...showModal, isShow: false });
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(actions.controlLoading(false));
        })
        .catch((error) => {
          console.error(error);
          setShowModal({ ...showModal, isShow: false });
          dispatch(actions.controlLoading(false));
        });
    }
  };

  const fetchOrderById = (id: number) => {
    requestApi(`/order/${id}`, 'GET', [])
      .then((response) => {
        setShowModal({ isShow: true, title: 'View Order', isShowFooter: false, currentOrderById: response.data });
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  };

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    const query = `?items_per_page=${itemsPerPage}&page=${currentPage}&keyword=${keyword}`;
    requestApi(`/order${query}`, 'GET', [])
      .then((response) => {
        console.log(response);
        setOrderList(response.data.data);
        setNumOfPage(response.data.lastPage);
        setCurrentPage(response.data.currentPage);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, keyword, refresh]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Order List</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/order-history-list">Order</Link>
            </li>
            <li className="breadcrumb-item active">Order history list</li>
          </ol>

          <div className="mb-3">
            <Link to="/order/add" className="btn btn-sm btn-success me-2">
              <i className="fa fa-plus" />
              Add New
            </Link>
            {selectedRows.length > 0 && (userRole === PERMISSIONS.ADMIN || userRole === PERMISSIONS.SUPERADMIN) && (
              <button className="btn btn-sm btn-danger me-2" type="button" onClick={handleMultiDelete}>
                <i className="fa fa-trash" />
                Delete
              </button>
            )}
          </div>

          <DataTable
            data={orderList}
            title="List Orders"
            columns={columnsTable}
            numOfPage={numOfPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemPerPage={setItemPerPage}
            onChangeKeyword={setKeyword}
            itemsPerPage={itemsPerPage}
            onSelectedRows={(rows: any) => {
              console.log('selected rows in user list', rows);
              setSelectedRows(rows);
            }}
            keywordSearch="ID , Name or Phone Number"
            roleAdmin="no-show"
          />
        </div>
      </main>
      {renderModalView()}
    </div>
  );
};

export default CustomerList;
