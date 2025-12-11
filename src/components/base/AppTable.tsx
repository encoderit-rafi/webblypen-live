// "use client";
// import { nanoid } from "nanoid";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ReactNode } from "react";

// interface AppTableProps<T> {
//   data: T[];
//   columns: ColumnDef<T>[];
//   footer?: ReactNode;
// }

// export default function AppTable<T>({
//   data,
//   columns,
//   footer,
// }: AppTableProps<T>) {
//   const table = useReactTable({
//     data: data ?? [],
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const rows = table.getRowModel().rows;

//   return (
//     <Table className="border">
//       <TableHeader>
//         {table.getHeaderGroups().map((headerGroup) => (
//           <TableRow key={headerGroup.id} className="hover:bg-transparent">
//             {headerGroup.headers.map((header, index) => (
//               <TableHead
//                 className="h-11 text-start  text-muted-foreground border whitespace-nowrap"
//                 // key={index}
//                 key={nanoid()}
//               >
//                 {header.isPlaceholder
//                   ? null
//                   : flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//               </TableHead>
//             ))}
//           </TableRow>
//         ))}
//       </TableHeader>

//       <TableBody>
//         {rows.map((row, index) => (
//           <TableRow key={row.id} className="hover:bg-transparent text-primary">
//             {row.getVisibleCells().map((cell) => (
//               <TableCell
//                 // key={index}
//                 key={nanoid()}
//                 className="whitespace-nowrap border max-w-full truncate"
//               >
//                 {/* // <td > */}
//                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 {/* // </td> */}
//               </TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//       {footer}
//     </Table>
//   );
// }

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";

interface AppTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  footer?: ReactNode;
}

export default function AppTable<T>({
  data,
  columns,
  footer,
}: AppTableProps<T>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <Table className="border">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup, index) => (
          <TableRow
            key={headerGroup.id + index}
            className="hover:bg-transparent"
          >
            {headerGroup.headers.map((header, index) => (
              <TableHead
                className="h-11 text-start text-muted-foreground border whitespace-nowrap"
                key={header.id + index}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => (
            <TableRow
              key={row.id + index}
              className="hover:bg-transparent text-primary"
            >
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id + index}
                  className="whitespace-nowrap border max-w-full truncate"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
      {footer}
    </Table>
  );
}
