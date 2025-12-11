"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ModalType } from "@/types/global";
import AppStatus from "@/components/base/AppStatus";
import AppViewDialog from "../AppViewDialog";
import { format } from "date-fns";
import AppTable from "../AppTable";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { useQueryGetOpenMarket } from "@/app/(app)/open-market/_api/queries/useQueryGetOpenMarket";
import {
  OpenMarketSchema,
  OpenMarketSchemaType,
} from "@/app/(app)/open-market/_types/open_market_types";

type TProps = ModalType & {
  title: string;
  id: string | number;
};

const OpenMarketCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetOpenMarket({
    enabled: !!id,
    id,
  });
  const { control, reset, watch } = useForm<OpenMarketSchemaType>({
    resolver: zodResolver(OpenMarketSchema),
    defaultValues: {},
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });
  useEffect(() => {
    if (!!data) {
      reset(data);
    }
  }, [data, reset]);
  const headings = [
    {
      title: "Branch",
      values: watch("branch.name"),
    },
    {
      title: "Supplier",
      values: watch("supplier.name"),
    },
    {
      title: "OMP Number",
      values: watch("omp_number"),
    },
    {
      title: "Note",
      values: watch("note"),
    },
    {
      title: "Purchase Date",
      values: watch("purchase_date")
        ? format(watch("purchase_date"), "PPP")
        : "",
    },
  ];
  const calculations = [
    // {
    //   title: "VATABLE SALES",
    //   values: Number(watch("vatable_amount")).toFixed(4) || 0,
    // },
    // {
    //   title: "NON VATABLE SALES",
    //   values: Number(watch("non_vatable_amount")).toFixed(4) || 0,
    // },
    {
      title: "VAT (%)",
      values: Number(watch("vat_amount")).toFixed(2) || 0,
    },
    {
      title: "TOTAL (VAT INC.)",
      values: Number(watch("total_amount")).toFixed(2) || 0,
    },
    // {
    //   title: "W/TAX (%)",
    //   values: watch("w_tax_percentage") || 0,
    // },
    // {
    //   title: "W/TAX AMOUNT",
    //   values: watch("w_tax_amount") || 0,
    // },
    // {
    //   title: "DUE AMOUNT",
    //   values: watch("due_amount") || 0,
    // },
  ];
  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="grid grid-cols-3">
          {headings.map(({ title, values }, index) => (
            <div
              key={index}
              className="p-1 whitespace-nowrap max-w-full truncate capitalize space-x-2"
            >
              <span className="font-semibold text-primary">{title} :</span>
              <span className="text-muted-foreground">{values}</span>
            </div>
          ))}

          <div className="col-span-full">
            <AppTable
              data={fields ?? []}
              columns={[
                {
                  // header: "Product",
                  header: "Product",
                  accessorKey: "product_id",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`items.${index}.product`)?.name;
                  },
                },
                {
                  header: "Quantity",
                  accessorKey: "quantity",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`items.${index}.quantity`);
                  },
                },
                {
                  header: "UOM",
                  accessorKey: "unit_id",

                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`items.${index}.unit`)?.name;
                  },
                },

                {
                  header: "Price",
                  accessorKey: "unit_price",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`items.${index}.unit_price`);
                  },
                },
                {
                  header: "Total Price",
                  accessorKey: "total_price",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`items.${index}.total_price`);
                  },
                },
              ]}
              footer={calculations.map((data, index) => (
                <TableFooter key={index} className="bg-transparent">
                  <TableRow>
                    <TableCell colSpan={4} className="text-end">
                      {data.title}
                    </TableCell>
                    <TableCell colSpan={2} className="border">
                      {data.values}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              ))}
            />
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default OpenMarketCard;
