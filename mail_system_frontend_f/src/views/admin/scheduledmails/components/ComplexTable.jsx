import React from "react";
import Card from "components/card";
import { IoMdTrash } from "react-icons/io";
import { Link } from "react-router-dom";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MdOutlineOpenInNew } from "react-icons/md";
import { MdCheckCircle, MdOutlineError } from "react-icons/md";



const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable(props) {
  const { tableData, setDeleteId, setDeleteModelOpen } = props;
  const [sorting, setSorting] = React.useState([]);
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">MAIL ID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("type", {
      id: "number",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          TYPE
        </p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
          </p>
      ),
    }),
      columnHelper.display({
          id: "schedueled_on",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  SCHEDUELED ON
              </p>
          ),
          cell: ({row}) => {
            const date = new Date(row.original.schedueled_at)
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDate()

            return (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {year + "-" + month + "-" + day}
              </p>
            )
          },
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
                {info.getValue() === "sent" ? (
                  <MdCheckCircle className="text-green-500 me-1 dark:text-green-300" />
                ) : (
                  <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300" />
                )}
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
                </p>
              </div>
            ),
          }),
      columnHelper.accessor("day", {
          id: "day",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  DAY
              </p>
          ),
          cell: (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue() || "N/A"}
              </p>
          ),
      }),
      columnHelper.accessor("date", {
          id: "date",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  DATE
              </p>
          ),
          cell: (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue() || "N/A"}
              </p>
          ),
      }),
      columnHelper.accessor("month", {
          id: "month",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  MONTH
              </p>
          ),
          cell: (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue() || "N/A"}
              </p>
          ),
      }),
    
      // Open Column
      columnHelper.display({
          id: "open",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  OPEN
              </p>
          ),
          cell: ({ row }) => {
              const mail = row.original;
              return (
                  <Link
                      to = {`/admin/view/scheduled-mail/${mail.id}`}
                      className="p-2 bg-blue-500 w-8 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                  >
                      <MdOutlineOpenInNew />
                  </Link>
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
              const mail = row.original;
              return (
                  <button
                      onClick={() => {
                        setDeleteId(mail.id)
                        setDeleteModelOpen(true)
                      }}
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
          Scheduled Mails Table
        </div>
    
      </div>

      <div className="mt-8">
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
                          className="border-white/0 py-3  pr-4"
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