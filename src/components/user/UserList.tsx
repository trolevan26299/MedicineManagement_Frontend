import React, { useState, useEffect } from 'react';
import DataTable from '../common/DataTable';
import { requestApi } from '../../helpers/api';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../Redux/actions';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RootState } from '../../Redux/reducers/globalLoading';
import { PERMISSIONS } from '../../constant/common';

const UserList = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.globalLoading.role);
  const [users, setUsers] = useState([]);
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
      element: (row: any) => row.id,
      show: true,
    },
    {
      name: 'First name',
      element: (row: any) => row.first_name,
      show: true,
    },
    {
      name: 'Last name',
      element: (row: any) => row.last_name,
      show: true,
    },
    {
      name: 'Email',
      element: (row: any) => row.email,
      show: true,
    },
    {
      name: 'Created at',
      element: (row: any) => row.created_at,
      show: true,
    },
    {
      name: 'Updated at',
      element: (row: any) => row.updated_at,
      show: true,
    },
    {
      name: 'Actions',
      element: (row: any) => (
        <>
          <Link className="btn btn-sm btn-warning me-1" to={`/user/edit/${row.id}`}>
            <i className="fa fa-pencil-alt" />
            Edit
          </Link>
          <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(row.id)}>
            <i className="fa fa-trash" />
            Delete
          </button>
        </>
      ),
      show: userRole === PERMISSIONS.ADMIN || userRole === PERMISSIONS.SUPERADMIN,
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
      requestApi(`/users/${deleteItem}`, 'DELETE', [])
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
      requestApi(`/users/multiple?ids=${selectedRows.toString()}`, 'DELETE', [])
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
    requestApi(`/users${query}`, 'GET', [])
      .then((response) => {
        console.log(response);
        setUsers(response.data.data);
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
          <h1 className="mt-4">User</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/users">Users</Link>
            </li>
            <li className="breadcrumb-item active">List Users</li>
          </ol>
          {(userRole === PERMISSIONS.ADMIN || userRole === PERMISSIONS.SUPERADMIN) && (
            <div className="mb-3">
              <Link to="/user/add" className="btn btn-sm btn-success me-2">
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
          )}
          <DataTable
            data={users}
            title="List Users"
            columns={columnsTable.filter((column) => column?.show)}
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
            keywordSearch="Name or Email"
            roleAdmin={userRole}
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

export default UserList;
