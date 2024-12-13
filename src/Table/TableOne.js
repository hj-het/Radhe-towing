import React from "react";
import { useTable } from "react-table";
import { FaEdit, FaTrashAlt, FaKey } from "react-icons/fa"; 
import { GiHook } from "react-icons/gi";
import "./table.css";

const TableOne = ({
  columns,
  data,
  handleDelete,
  handleEdit,
  handlePasswordReset,
  isEmployeeTable,
  isServiceTable,
  handleCompletedCount,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Get role from localStorage
  const role = localStorage.getItem("role"); // Assuming role is stored as "employee" or "admin"

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.id}
              {...headerGroup.getHeaderGroupProps()}
              className="table-header-row"
            >
              {headerGroup.headers.map((column) => {
                const { key, ...rest } = column.getHeaderProps();
                return (
                  <th key={key} {...rest} className="table-header">
                    {column.render("Header")}
                  </th>
                );
              })}
              {isServiceTable ? (
                <th className="table-header">Action</th>
              ) : (
                role === "admin" && <th className="table-header">Actions</th>
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()} className="table-row">
                {row.cells.map((cell) => {
                  const { key, ...rest } = cell.getCellProps();
                  return (
                    <td key={key} {...rest} className="table-cell">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
                <td className="table-cell">
                  <div className="tablebutton">
                    {/* This button is always visible for both admin and employee */}
                    {isServiceTable && (
                      <button
                        className="btn-reset"
                        onClick={() =>
                          handleCompletedCount(
                            row.original.member?.id,
                            row.original.vehicle?.id
                          )
                        }
                      >
                        <GiHook />
                      </button>
                    )}

                    {/* Only show these buttons for admin */}
                    {role === "admin" && (
                      <>
                        {isEmployeeTable && (
                          <button
                            className="btn-reset"
                            onClick={() => handlePasswordReset(row.original)}
                          >
                            <FaKey /> {/* Password reset icon */}
                          </button>
                        )}

                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(row.original)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(row.original)}
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableOne;
