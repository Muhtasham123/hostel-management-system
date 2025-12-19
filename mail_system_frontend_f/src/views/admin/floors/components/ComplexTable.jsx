import React from "react";
import Card from "components/card";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import { Link } from "react-router-dom";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable(props) {
  const { tableData, dispatch } = props;
  const [sorting, setSorting] = React.useState([]);
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">FLOOR ID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("number", {
      id: "number",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          FLOOR NUMBER
        </p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
          </p>
      ),
    }),
      columnHelper.accessor("noOfRooms", {
          id: "noOfRooms",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  NUMBER OF ROOMS
              </p>
          ),
          cell: (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
              </p>
          ),
      }),
    columnHelper.display({
      id: "date_created",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">DATE CREATED</p>
      ),
      cell: ({row}) => {
        const date = new Date(row.original.date_created)
        const year  = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()

        return (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {year + "-" + month + "-" + day}
        </p>
        )
      },
    }),
    
      // Edit Column
      columnHelper.display({
          id: "edit",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  EDIT
              </p>
          ),
          cell: ({ row }) => {
              const floor = row.original;
              return (
                  <button
                      onClick={()=>dispatch({type:"open_model", 
                        payload:{
                            floorNumber:floor.number,
                            floorId:floor.id
                      }})}
                      className="p-2 bg-green-500 w-8 text-white rounded hover:bg-green-600 flex items-center justify-center"
                  >
                      <IoMdCreate />
                  </button>
              );
          },
      }),

      // Delete Column
      columnHelper.display({
          id: "delete",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  DELETE
              </p>
          ),
          cell: ({ row }) => {
              const floor = row.original;
              return (
                  <button
                      onClick={() => dispatch({
                          type: "open_delete_model",
                          payload: {
                              floorId: floor.id
                          }
                      })}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                  >
                      <IoMdTrash />
                  </button>
              );
          },
      }),
  ]; // eslint-disable-next-line
  const table = useReactTable({
    data:tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Floors Table
        </div>
    
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}