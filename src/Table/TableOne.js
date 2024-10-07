// Table.js
import React, {  } from 'react';
import { useTable } from 'react-table';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import "./table.css"

const TableOne = ({ columns, data, handleDelete, handleEdit }) => {
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
        <table {...getTableProps()} className="table">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                            <td>
                                <button onClick={() => handleEdit(row.original)}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(row.original)}>
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default TableOne;
