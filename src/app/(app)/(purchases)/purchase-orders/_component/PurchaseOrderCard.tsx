"use client";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ModalType } from "@/types/global";

import AppStatus from "@/components/base/AppStatus";
import AppViewDialog from "../../../../../components/base/AppViewDialog";
import { format } from "date-fns";
import { useQueryGetPurchaseOrderByID } from "@/app/(app)/(purchases)/purchase-orders/_api/queries/useQueryGetPurchaseOrderByID";
import {
  PurchaseOrderSchema,
  PurchaseOrderSchemaType,
} from "@/app/(app)/(purchases)/purchase-orders/_types/purchase_order_types";
import AppTable from "../../../../../components/base/AppTable";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

type TProps = ModalType & {
  title: string;
  type: string;
  id: string | number;
};
const PurchaseOrderCard = ({ id, title, type, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetPurchaseOrderByID({
    enabled: type == "view" && !!id,
    id: id,
  });

  const {
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseOrderSchemaType>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {},
  });

  const { fields } = useFieldArray({
    control,
    name: "purchase_items",
  });
  useEffect(() => {
    if (data) {
      reset({ ...data, purchase_items: data.purchase_request_items });
    }
  }, [data, reset]);
  const headings = [
    {
      title: "Supplier",
      values: watch("supplier.name"),
    },
    {
      title: "Email",
      values: watch("supplier.email"),
    },
    {
      title: "Address",
      values: watch("supplier.address"),
    },
    {
      title: "Phone",
      values: watch("supplier.phone"),
    },
    {
      title: "TIN",
      values: watch("supplier.tin_number"),
    },
    {
      title: "Date",
      values:
        watch("expected_delivery_date") &&
        format(watch("expected_delivery_date"), "PPP"),
    },
  ];
  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="grid grid-cols-3 ">
          {headings.map(({ title, values }, index) => (
            <div
              key={index}
              className="p-1 whitespace-nowrap max-w-full truncate space-x-2"
            >
              <span className="font-semibold text-primary">{title} :</span>
              <span className="text-muted-foreground">{values}</span>
            </div>
          ))}

          <div className="p-1 whitespace-nowrap max-w-full truncate col-span-full mt-5 mb-1">
            <span className="font-semibold text-primary">Products </span>
          </div>

          <div className="col-span-full">
            <AppTable
              data={fields ?? []}
              columns={[
                {
                  header: "Product",
                  accessorKey: "product",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`purchase_items.${index}.product`).name;
                  },
                },
                {
                  header: "UOM",
                  accessorKey: "unit",

                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`purchase_items.${index}.unit`).name;
                  },
                },
                {
                  header: "Receive Quantity",
                  accessorKey: "quantity",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`purchase_items.${index}.receive_quantity`);
                  },
                },
                {
                  header: "Price",
                  accessorKey: "unit_price",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`purchase_items.${index}.unit_price`);
                  },
                },
                {
                  header: "Total Price",
                  accessorKey: "total_price",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`purchase_items.${index}.total_price`);
                  },
                },
              ]}
              footer={
                <TableFooter className="bg-transparent">
                  <TableRow>
                    <TableCell colSpan={4} className="text-end">
                      Total
                    </TableCell>
                    <TableCell colSpan={2} className="border">
                      {watch("total_amount")}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              }
            />
          </div>
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default PurchaseOrderCard;
