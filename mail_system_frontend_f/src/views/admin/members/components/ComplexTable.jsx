import React from "react";
import Card from "components/card";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import { MdCancel, MdCheckCircle, MdOutlineError } from "react-icons/md";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { membersHandler } from "../variables/handlers";
import { context } from "context";
import { useContext } from "react"

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable(props) {
  const {hostelContext} = useContext(context)
  const { tableData, dispatch, checkRefs, recipients, setRecipients } = props;
  const [sorting, setSorting] = React.useState([]);
  const columns = [
     columnHelper.display({
      id: "select",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">SELECT</p>
      ),
      cell: ({row}) => (
        <input type="checkbox" ref={(el) => {
          if (el) checkRefs.current[row.original.id] = el;
        }}
        checked={recipients.includes(row.original.id)}
        onChange = {
          (e)=>{
            const check = e.target.checked
            if(check){
              const newRecipients = [...recipients, row.original.id]
              setRecipients(newRecipients)
              console.log(recipients)
            }else{
              const newRecipients = recipients.filter((id)=>id != row.original.id)
              setRecipients(newRecipients)
              console.log(recipients)
            }
          }
        }
        className="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
        justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
        checked:text-white hover:cursor-pointer dark:border-white/10
        checked:border-none checked:bg-purple-500 dark:checked:bg-purple-400"
        />
      ),
    }),
    columnHelper.accessor("id", {
      id: "id",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">MEMBER ID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          NAME
        </p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
          </p>
      ),
    }),
      columnHelper.accessor("email", {
          id: "email",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  EMAIL
              </p>
          ),
          cell: (info) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
              </p>
          ),
      }),

      columnHelper.accessor("role", {
          id: "role",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  ROLE
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
          {info.getValue() === "active" ? (
            <MdCheckCircle className="text-green-500 me-1 dark:text-green-300" />
          ) : info.getValue() === "pending" ? (
            <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300" />
            ) : <MdCancel className="text-red-500 me-1 dark:text-red-300" />}
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      ),
    }),

      columnHelper.display({
          id: "floor",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  FLOOR
              </p>
          ),
          cell: ({row}) => {
              const {role} = row.original
              return(
                
                role === "resident"
                ?
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {row.original.floor}
                </p>
                :
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  N/A
                </p>
              )
            },
      }),
    
      columnHelper.display({
          id: "room",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  ROOM
              </p>
          ),
          cell: ({ row }) => {
              const { role } = row.original
              return (

                  role === "resident"
                      ?
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.room}
                      </p>
                      :
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                          N/A
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
              const member = row.original;
              return (
                  <button
                      onClick={()=>dispatch({type:"open_model", payload:member})}
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
              const member = row.original;
              return (
                  <button
                      onClick={() => dispatch({
                          type: "open_delete_model",
                          payload: {
                              memberId: member.id
                          }
                      })}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                  >
                      <IoMdTrash />
                  </button>
              );
          },
      }),

    columnHelper.display({
      id: "delete",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          UPDATE STATUS
        </p>
      ),
      cell: ({ row }) => {
        const member = row.original;
        const body = { status: member.status === "active" ? "inactive" : "active" }
        return (
          <button
            onClick={() =>{ 
              membersHandler("update_status", null, member.id, body, null, null, hostelContext)
              dispatch({type:"update_status"})
            }}
            
            disabled = {member.status === "pending"}
            className={`p-2 ${member.status === "active" ? "bg-green-200 hover:bg-green-400" : "bg-red-200 hover:bg-red-400"}  rounded  flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed`}
          >
            {
              member.status === "active" ?
              "Inactivate"
              :
              member.status === "inactive" ?
              "Activate"
              :
              "N / A"
            }
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
          Members Table
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