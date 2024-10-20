import React from 'react';
import { useTable } from 'react-table';
import { FaEdit, FaTrashAlt, FaKey } from 'react-icons/fa'; // Import the reset icon
import './table.css';

const TableOne = ({ columns, data, handleDelete, handleEdit, handlePasswordReset, isEmployeeTable }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });

    return (
        <div className="table-container">
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="table-header-row">
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="table-header">
                                    {column.render('Header')}
                                </th>
                            ))}
                            <th className="table-header">Actions</th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="table-row">
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="table-cell">
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                                <td className="table-cell">
                                    <div className='tablebutton'>
                                    {isEmployeeTable && ( // Only show reset icon if it's the employee table
                                            <button className="btn-reset" onClick={() => handlePasswordReset(row.original)}>
                                                <FaKey /> {/* Password reset icon */}
                                            </button>
                                        )}
                                        <button className="btn-edit" onClick={() => handleEdit(row.original)}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(row.original)}>
                                            <FaTrashAlt />
                                        </button>
                                       
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
