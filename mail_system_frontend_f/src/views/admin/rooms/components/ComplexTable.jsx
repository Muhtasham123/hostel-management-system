import React from "react";
import Card from "components/card";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import { MdCheckCircle, MdOutlineError } from "react-icons/md";

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
        <p className="text-sm font-bold text-gray-600 dark:text-white">ROOM ID</p>
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
          ROOM NUMBER
        </p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
          </p>
      ),
    }),
      columnHelper.accessor("seats", {
          id: "seats",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  SEATS
              </p>
          ),
          cell: (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
              </p>
          ),
      }),

      columnHelper.accessor("status", {
            id: "status",
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                STATUS
              </p>
            ),
            cell: (info) => (
              <div className="flex items-center">
                {info.getValue() === "Available" ? (
                  <MdCheckCircle className="text-green-500 me-1 dark:text-green-300" />
                ) : info.getValue() === "Unavailable" ? (
                  <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300" />
                ) : null}
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
                </p>
              </div>
            ),
          }),

      columnHelper.accessor("floor_number", {
          id: "floor_number",
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
    
      // Edit Column
      columnHelper.display({
          id: "edit",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  EDIT
              </p>
          ),
          cell: ({ row }) => {
              const room = row.original;
              return (
                  <button
                      onClick={()=>dispatch({type:"open_model", payload:room})}
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
              const room = row.original;
              return (
                  <button
                      onClick={() => dispatch({
                          type: "open_delete_model",
                          payload: {
                              roomId: room.id
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