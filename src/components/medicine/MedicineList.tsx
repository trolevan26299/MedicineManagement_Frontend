import React, { useState, useEffect } from 'react';
import DataTable from '../common/DataTable';
import { apiUrl, requestApi } from '../../helpers/api';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions';
import { formatCurrency } from '../../constant/common';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MedicineList = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(10);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState('single');
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const columnsTable = [
    {
      name: 'ID',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1 }}>{row.id}</div>
      ),
    },

    {
      name: 'Image',
      element: (row: any) =>
        (
          <img
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            src={`${apiUrl}/${row.thumbnail}`}
            alt=""
          />
        ) || '',
    },
    {
      name: 'Name',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1 }}>{row.title}</div>
      ),
    },

    {
      name: 'Category',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1, justifyContent: 'center' }}>
          {row.category ? row.category.name : ''}
        </div>
      ),
    },
    {
      name: 'Quantity',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1, justifyContent: 'center' }}>
          {row.quantity}
        </div>
      ),
    },
    {
      name: 'Price',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1, justifyContent: 'center' }}>
          {formatCurrency(row.price)}
        </div>
      ),
    },
    {
      name: 'Sale Price',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1, justifyContent: 'center' }}>
          {row.price_sale === 0 ? 'No Sale' : formatCurrency(row.price_sale)}
        </div>
      ),
    },
    {
      name: 'Description',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1, justifyContent: 'center' }}>
          {row.description}
        </div>
      ),
    },
    {
      name: 'Createred',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1, justifyContent: 'center' }}>
          {row.user ? row.user.first_name : ''}
        </div>
      ),
    },
    {
      name: 'Status',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', flexGrow: 1 }}>
          <span
            className={`badge rounded-pill ${row.status === 1 ? 'bg-success' : 'bg-danger'}`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {row.status === 1 ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    },
    {
      name: 'Actions',
      element: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px', width: '150px' }}>
          <Link className="btn btn-sm btn-warning me-1" to={`/medicine/edit/${row.id}`}>
            <i className="fa fa-pencil-alt" />
            Edit
          </Link>
          <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(row.id)}>
            <i className="fa fa-trash" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = (id: any) => {
    setShowModal(true);
    setDeleteItem(id);
    setDeleteType('single');
  };

  const handleMultiDelete = () => {
    setShowModal(true);

    setDeleteType('multi');
  };

  const requestDeleteApi = () => {
    if (deleteType === 'single') {
      dispatch(actions.controlLoading(true));
      requestApi(`/medicines/${deleteItem}`, 'DELETE', [])
        .then(() => {
          setShowModal(false);
          setRefresh(Date.now());
          dispatch(actions.controlLoading(false));
        })
        .catch((error) => {
          console.error(error);
          setShowModal(false);
          dispatch(actions.controlLoading(false));
        });
    } else {
      dispatch(actions.controlLoading(true));
      requestApi(`/medicines/multiple?ids=${selectedRows.toString()}`, 'DELETE', [])
        .then(() => {
          setShowModal(false);
          setRefresh(Date.now());
          setSelectedRows([]);
          dispatch(actions.controlLoading(false));
        })
        .catch((error) => {
          console.error(error);
          setShowModal(false);
          dispatch(actions.controlLoading(false));
        });
    }
  };
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    const query = `?items_per_page=${itemsPerPage}&page=${currentPage}&keyword=${keyword}`;
    requestApi(`/medicines${query}`, 'GET', [])
      .then((response) => {
        console.log(response);
        setPosts(response.data.data);
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
          <h1 className="mt-4">Medicine List</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/medicines">Medicine</Link>
            </li>
            <li className="breadcrumb-item active">List Medicine</li>
          </ol>

          <div className="mb-3">
            <Link to="/medicine/add" className="btn btn-sm btn-success me-2">
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
            data={posts}
            title="List Medicine"
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
            keywordSearch="Name or Description"
          />
        </div>
      </main>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are yous sure want to delete ?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
          <Button className="btn-danger" onClick={requestDeleteApi}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicineList;
