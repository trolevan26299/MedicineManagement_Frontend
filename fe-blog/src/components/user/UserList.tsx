import React, { useState, useEffect } from 'react';
import DataTable from '../common/DataTable';
import { requestApi } from '../../helpers/api';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions';

const UserList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const columnsTable = [
    {
      name: 'ID',
      element: (row: any) => row.id,
    },
    {
      name: 'First name',
      element: (row: any) => row.first_name,
    },
    {
      name: 'Last name',
      element: (row: any) => row.last_name,
    },
    {
      name: 'Email',
      element: (row: any) => row.id,
    },
    {
      name: 'Created at',
      element: (row: any) => row.created_at,
    },
    {
      name: 'Updated at',
      element: (row: any) => row.updated_at,
    },
    {
      name: 'Actions',
      element: () => (
        <>
          <button type="button" className="btn btn-sm btn-warning me-1">
            <i className="fa fa-pencil-alt" />
            Edit
          </button>
          <button type="button" className="btn btn-sm btn-danger me-1">
            <i className="fa fa-trash" />
            Delete
          </button>
        </>
      ),
    },
  ];

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
  }, [currentPage, itemsPerPage, keyword]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Tables</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <a href="index.html">Dashboard</a>
            </li>
            <li className="breadcrumb-item active">Tables</li>
          </ol>
          <DataTable
            data={users}
            title="List Users"
            columns={columnsTable}
            numOfPage={numOfPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onChangeItemPerPage={setItemPerPage}
            onChangeKeyword={setKeyword}
          />
        </div>
      </main>
    </div>
  );
};

export default UserList;
