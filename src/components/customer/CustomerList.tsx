import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../Redux/actions';
import { requestApi } from '../../helpers/api';
import DataTable from '../common/DataTable';
import { IDetailOrder } from '../order/OrderHistoryList';
import CommonModal from '../common/Modal';
import ModalHistoryOrder from './ModalHistoryOrder';

export interface ICustomer {
  address: string;
  birth_day: string;
  email: string;
  full_name: string;
  id: number;
  phone_number: string;
}

export interface IHistoryOrder {
  id: number;
  total_price: number;
  updated_at: string;
  description: string;
  created_at: string;
  customer: ICustomer;
  details: IDetailOrder;
}

const CustomerList = () => {
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState([]);
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState('single');
  const [refresh, setRefresh] = useState(Date.now());
  const [showModal, setShowModal] = useState<{
    isShow: boolean;
    title: string;
    content?: string;
    isShowFooter: boolean;
    currentOrderHistoryId: number | null;
    titleFooter?: string;
  }>({
    isShow: false,
    title: '',
    isShowFooter: false,
    currentOrderHistoryId: null,
  });
  const renderModalView = () => {
    return (
      <CommonModal
        show={showModal.isShow}
        onHide={() =>
          setShowModal({ ...showModal, isShow: false, currentOrderHistoryId: null, titleFooter: undefined })
        }
        onFnc={requestDeleteApi}
        titleFooter={showModal.titleFooter}
        size={showModal?.content ? 'sm' : 'lg'}
        data={
          showModal.content ? showModal.content : <ModalHistoryOrder id={showModal.currentOrderHistoryId as number} />
        }
        title={showModal.title}
      />
    );
  };

  const columnsTable = [
    {
      name: 'ID',
      element: (row: any) => row.id,
    },
    {
      name: 'Full Name',
      element: (row: any) => row.full_name,
    },
    {
      name: 'Birth Day',
      element: (row: any) => (row.birth_day ? moment(row.birth_day).format('DD/MM/YYYY') : ''),
    },
    {
      name: 'Phone Number',
      element: (row: any) => row.phone_number,
    },
    {
      name: 'Address',
      element: (row: any) => row.address,
    },
    {
      name: 'Email',
      element: (row: any) => row.email,
    },
    {
      name: 'Createred',
      element: (row: any) => (row.user ? row.user.first_name : ''),
    },
    {
      name: 'Status',
      element: (row: any) =>
        row.status === 1 ? (
          <span className="badge rounded-pill bg-success">Active</span>
        ) : (
          <span className="badge rounded-pill bg-danger">Inactive</span>
        ),
    },
    {
      name: 'History Order',
      element: (row: any) => (
        <>
          <button
            className="btn btn-sm btn-info me-1"
            style={{ width: '100%' }}
            onClick={() => handleShowModalHistory(row.id)}
          >
            <i className="fa fa-history" style={{ marginRight: '5px' }} />
            Click
          </button>
        </>
      ),
    },
    {
      name: 'Actions',
      element: (row: any) => (
        <>
          <Link className="btn btn-sm btn-warning me-1" to={`/customer/edit/${row.id}`}>
            <i className="fa fa-pencil-alt" />
            Edit
          </Link>
          <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(row.id)}>
            <i className="fa fa-trash" />
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleShowModalHistory = (id: number) => {
    setShowModal({
      isShow: true,
      title: 'History Customer Order',
      isShowFooter: false,
      currentOrderHistoryId: id,
    });
  };

  const handleDelete = (id: any) => {
    setShowModal({
      ...showModal,
      title: 'Confirmation',
      content: 'Are yous sure want to delete ?',
      isShowFooter: true,
      isShow: true,
      titleFooter: 'Delete',
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
      requestApi(`/customer/${deleteItem}`, 'DELETE', [])
        .then(() => {
          setShowModal({ ...showModal, isShow: false, currentOrderHistoryId: null, titleFooter: undefined });
          setRefresh(Date.now());
          dispatch(actions.controlLoading(false));
        })
        .catch((error) => {
          console.error(error);
          setShowModal({ ...showModal, isShow: false, currentOrderHistoryId: null, titleFooter: undefined });
          dispatch(actions.controlLoading(false));
        });
    } else {
      dispatch(actions.controlLoading(true));
      requestApi(`/customer/multiple?ids=${selectedRows.toString()}`, 'DELETE', [])
        .then(() => {
          setShowModal({ ...showModal, isShow: false, currentOrderHistoryId: null, titleFooter: undefined });
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(actions.controlLoading(false));
        })
        .catch((error) => {
          console.error(error);
          setShowModal({ ...showModal, isShow: false, currentOrderHistoryId: null, titleFooter: undefined });
          dispatch(actions.controlLoading(false));
        });
    }
  };
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    const query = `?items_per_page=${itemsPerPage}&page=${currentPage}&keyword=${keyword}`;
    requestApi(`/customer${query}`, 'GET', [])
      .then((response) => {
        console.log(response);
        setCustomer(response.data.data);
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
          <h1 className="mt-4">Customer List</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/customers">Customer</Link>
            </li>
            <li className="breadcrumb-item active">List Customer</li>
          </ol>

          <div className="mb-3">
            <Link to="/customer/add" className="btn btn-sm btn-success me-2">
              <i className="fa fa-plus" />
              Add New
            </Link>
            {selectedRows.length > 0 && (
              <button className="btn btn-sm btn-danger me-2" type="button" onClick={handleMultiDelete}>
                <i className="fa fa-trash" />
                Delete
              </button>
            )}
          </div>
          <DataTable
            data={customer}
            title="List Customers"
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
            keywordSearch="Name , Phone or Email"
          />
        </div>
      </main>
      {renderModalView()}
    </div>
  );
};

export default CustomerList;
