/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import LiveSearch from './LiveSearch';
import { useState } from 'react';

const DataTable = ({
  data,
  title,
  columns,
  numOfPage,
  currentPage,
  onPageChange,
  onChangeItemPerPage,
  onChangeKeyword,
  onSelectedRows,
  itemsPerPage,
  keywordSearch,
  roleAdmin,
}: {
  data?: any;
  title: string;
  columns: any;
  numOfPage: number;
  currentPage: number;
  onPageChange: (item: number) => void;
  onChangeItemPerPage: (item: number) => void;
  onChangeKeyword: (keyword: string) => void;
  onSelectedRows: (rows: any) => void;
  itemsPerPage?: number;
  keywordSearch?: string;
  roleAdmin?: string;
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    console.log(selectedRows);
    onSelectedRows(selectedRows);
  }, [selectedRows]);

  const renderData = () => {
    return data?.map((item: any, index: number) => (
      <tr key={index}>
        {columns.map((col: any, ind: number) => (
          <td key={ind}>{col.element(item)}</td>
        ))}
      </tr>
    ));
  };

  const onClickCheckbox = (event: any) => {
    const checked = event.target.checked;
    const value = event.target.value;
    if (checked) {
      if (!selectedRows.includes(value)) {
        setSelectedRows([...selectedRows, value]);
      }
    } else {
      const index = selectedRows.indexOf(value);
      const temp = [...selectedRows];
      temp.splice(index, 1);
      setSelectedRows(temp);
    }
  };
  const renderHeaders = () => {
    return columns.map((col: any, index: number) => (
      <th key={index} scope="col">
        {col.name}
      </th>
    ));
  };

  const renderPagination = () => {
    const pagination = [];
    const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;
    pagination.push(
      <li key="prev" className={prevPage ? 'page-item' : 'page-item disabled'}>
        <button className="page-link" onClick={() => onPageChange(prevPage as number)}>
          &laquo;
        </button>
      </li>,
    );
    for (let i = 1; i <= numOfPage; i++) {
      pagination.push(
        <li key={i} className={currentPage === i ? 'page-item active' : 'page-item'}>
          <button className="page-link" onClick={() => onPageChange(i)}>
            {i}
          </button>
        </li>,
      );
    }
    pagination.push(
      <li key="next" className={nextPage ? 'page-item' : 'page-item disabled'}>
        <button className="page-link" onClick={() => onPageChange(nextPage as number)}>
          &raquo;
        </button>
      </li>,
    );
    return pagination;
  };

  const onSelectAll = (event: any) => {
    if (event.target.checked) {
      const temp = data.map((item: any) => String(item.id));
      setSelectedRows(temp);
    } else {
      setSelectedRows([]);
    }
  };
  const onChangeOptionPage = (event: any) => {
    const { value } = event.target;
    onChangeItemPerPage(value);
    onPageChange(1 as number);
  };
  return (
    <div className="card mb-4" style={{ height: '665px' }}>
      <div className="card-header" style={{ height: '50px' }}>
        <i className="fas fa-table me-1"></i>
        {title}
      </div>
      <div className="card-body" style={{ height: '640px' }}>
        <div className="row mb-3" style={{ height: '50px' }}>
          <div className="col-sm-12 col-md-6">
            <label htmlFor="a" className="d-inline-flex " style={{ alignItems: 'end' }}>
              Show
              <select
                name="example_length"
                className="form-select form-select-sm ms-1 me-1"
                onChange={onChangeOptionPage}
                value={itemsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
              entries
            </label>
          </div>
          <div className="col-sm-12 col-md-6 ">
            {keywordSearch && (
              <label htmlFor="b" className="d-inline-flex float-end" style={{ alignItems: 'end' }}>
                Search:
                <LiveSearch onChangeKeyword={onChangeKeyword} keywordSearch={keywordSearch} />
              </label>
            )}
          </div>
        </div>
        <table className="table table-striped table-bordered" cellSpacing="0" width="100%">
          <thead>
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
      {numOfPage > 1 && (
        <div className="row pt-2" style={{ height: '60px' }}>
          <div className="col-sm-12 col-md-7">
            <ul className="pagination justify-content-end">{renderPagination()}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
