/* eslint-disable no-unused-vars */
import React from 'react';
import LiveSearch from './LiveSearch';

const DataTable = ({
  data,
  title,
  columns,
  numOfPage,
  currentPage,
  onPageChange,
  onChangeItemPerPage,
  onChangeKeyword,
}: {
  data?: any;
  title: string;
  columns: any;
  numOfPage: number;
  currentPage: number;
  onPageChange: (item: number) => void;
  onChangeItemPerPage: (item: number) => void;
  onChangeKeyword: (keyword: string) => void;
}) => {
  console.log(numOfPage);
  console.log(currentPage);
  const renderData = () => {
    return data.map((item: any, index: number) => (
      <tr key={index}>
        <td>
          <input type="checkbox" className="form-check-input" />
        </td>
        {columns.map((col: any, ind: number) => (
          <td key={ind}>{col.element(item)}</td>
        ))}
      </tr>
    ));
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
  const onChangeOptionPage = (event: any) => {
    const { value } = event.target;
    onChangeItemPerPage(value);
  };
  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i>
        {title}
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-sm-12 col-md-6">
            <label htmlFor="a" className="d-inline-flex">
              Show
              <select
                name="example_length"
                className="form-select form-select-sm ms-1 me-1"
                onChange={onChangeOptionPage}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              entries
            </label>
          </div>
          <div className="col-sm-12 col-md-6 ">
            <label htmlFor="b" className="d-inline-flex float-end">
              Search:
              <LiveSearch onChangeKeyword={onChangeKeyword} />
            </label>
          </div>
        </div>
        <table className="table table-striped table-bordered" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <td>
                <input type="checkbox" className="form-check-input" />
              </td>
              {renderHeaders()}
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
        {numOfPage > 1 && (
          <div className="row">
            <div className="col-sm-12 col-md-7">
              <ul className="pagination justify-content-end">{renderPagination()}</ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
