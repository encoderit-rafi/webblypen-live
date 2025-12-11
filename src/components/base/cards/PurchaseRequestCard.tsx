"use client";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ModalType } from "@/types/global";
import AppStatus from "@/components/base/AppStatus";
import AppViewDialog from "../AppViewDialog";
import { format } from "date-fns";
import {
  PurchaseOrderProductSchemaType,
  PurchaseOrderSchema,
  PurchaseOrderSchemaType,
} from "@/app/(app)/(purchases)/purchase-orders/_types/purchase_order_types";
import { useQueryGetPrePurchaseOrder } from "@/app/(app)/(purchases)/purchase-orders/_api/queries/useQueryGetPrePurchaseOrder";
import AppTable from "../AppTable";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

type TProps = ModalType & {
  title: string;
  id: string | number;
};

const PurchaseRequestCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetPrePurchaseOrder({
    enabled: !!id,
    id,
  });
  type PurchaseOrdersAPIType = (typeof data.data)[number];

  const { control, reset, setValue, watch } = useForm<PurchaseOrderSchemaType>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {},
  });

  const { fields } = useFieldArray({
    control,
    name: "purchase_items",
  });

  // ✅ Watch for recalculation
  const purchaseItems = useWatch({ control, name: "purchase_items" });
  const wTaxPercentage = useWatch({ control, name: "w_tax_percentage" });

  // ✅ Recalculate whenever purchaseItems or wTax change
  useEffect(() => {
    if (!purchaseItems) return;

    // Update each line total
    purchaseItems.forEach(
      (item: PurchaseOrderProductSchemaType, index: number) => {
        const qty = Number(item.request_quantity || 0);
        const unitPrice = Number(item.unit_price || 0);
        const lineTotal = qty * unitPrice;

        if (lineTotal !== Number(item.total_price)) {
          setValue(`purchase_items.${index}.total_price`, String(lineTotal), {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    );

    // Totals
    const totalAmount = purchaseItems.reduce(
      (sum: number, item: PurchaseOrderProductSchemaType) =>
        sum + Number(item.total_price || 0),
      0
    );

    const nonVatableAmount = purchaseItems
      .filter((item) => Number(item.vat) === 0)
      .reduce((sum, item) => sum + Number(item.total_price || 0), 0);

    const vatableAmount = totalAmount - nonVatableAmount;
    const vatAmount = vatableAmount > 0 ? (vatableAmount / 1.12) * 0.12 : 0;

    const wTax = Number(wTaxPercentage || 0);
    const wTaxAmount = (totalAmount * wTax) / 100;
    const dueAmount = totalAmount - wTaxAmount;

    // Update form fields
    setValue("total_amount", String(totalAmount));
    setValue("non_vatable_amount", String(nonVatableAmount));
    setValue("vatable_amount", String(vatableAmount));
    setValue("vat_amount", String(vatAmount));
    setValue("w_tax_amount", String(wTaxAmount));
    setValue("due_amount", String(dueAmount));
  }, [purchaseItems, wTaxPercentage, setValue]);

  function formatPurchaseOrder(
    data: PurchaseOrdersAPIType
  ): PurchaseOrderSchemaType {
    const purchaseItems = (data.purchase_request_items || []).map(
      (item: any) => ({
        id: item.id,
        product: item.product,
        // unit: {
        //   id: item.unit?.id ?? "",
        //   value: String(item.unit?.id ?? ""),
        //   label: item.unit?.name ?? "",
        // },
        unit: item.unit,
        request_quantity: item.quantity ?? "",
        receive_quantity: "",
        unit_price: item.unit_price ?? "",
        vat: item.vat ?? "",
        total_price: item.total_price ?? "",
      })
    );

    return {
      purchase_request_id: data.purchase_request_id ?? "",
      supplier: data.supplier,
      branch: data.branch,
      purchase_date: data.pr_date ?? "",
      expected_delivery_date: data?.expected_delivery_date || "",
      note: data.note ?? "",
      vat_percentage: "12",
      vat_amount: "0",
      w_tax_percentage: String(data.supplier?.w_tax ?? 0),
      w_tax_amount: "0",
      non_vatable_amount: "0",
      vatable_amount: "0",
      total_amount: "0",
      due_amount: "0",
      purchase_items: purchaseItems,
    };
  }

  useEffect(() => {
    if (data) {
      const formattedData = formatPurchaseOrder(data);
      reset(formattedData);
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
  const calculations = [
    {
      title: "VATABLE SALES",
      values: Number(watch("vatable_amount")).toFixed(2) || 0,
    },
    {
      title: "NON VATABLE SALES",
      values: Number(watch("non_vatable_amount")).toFixed(2) || 0,
    },
    {
      title: "VAT (%)",
      values: Number(watch("vat_amount")).toFixed(2) || 0,
    },
    {
      title: "TOTAL (VAT INC.)",
      values: Number(watch("total_amount")).toFixed(2) || 0,
    },
    {
      title: "W/TAX (%)",
      values: watch("w_tax_percentage") || 0,
    },
    {
      title: "W/TAX AMOUNT",
      values: Number(watch("w_tax_amount")).toFixed(2) || 0,
    },
    {
      title: "DUE AMOUNT",
      values: Number(watch("due_amount")).toFixed(2) || 0,
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
                  header: "Quantity",
                  accessorKey: "quantity",
                  cell: ({ row }) => {
                    const index = row.index;
                    return watch(`purchase_items.${index}.request_quantity`);
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

export default PurchaseRequestCard;
