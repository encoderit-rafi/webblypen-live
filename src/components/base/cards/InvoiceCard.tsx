"use client";
import { format } from "date-fns";
import { ModalType } from "@/types/global";
import AppViewDialog from "../AppViewDialog";
import { useQueryGetInvoice } from "@/app/(app)/invoices-and-payments/_api/queries/useQueryGetInvoice";
import AppStatus from "../AppStatus";

type TProps = ModalType & {
  title: string;
  id: string | number;
};
const InvoiceCard = ({ id, title, open, onOpenChange }: TProps) => {
  const { data, status } = useQueryGetInvoice({
    enabled: !!id,
    id: id,
  });

  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <AppStatus status={status} is_data={!!data}>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {/* Basic Info */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Invoice #: </span>
            {data?.invoice_number}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Category: </span>
            {data?.invoice_category?.name}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Purchase: </span>
            {data?.purchase?.po_number}
          </div>

          {/* Branch & Supplier */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Branch: </span>
            {data?.branch?.name}
          </div>
          <div className="p-1 whitespace-nowrap truncate col-span-2">
            <span className="font-semibold text-primary">Supplier: </span>
            {data?.supplier?.name}
          </div>

          {/* Dates */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Invoice Date: </span>
            {data?.invoice_date
              ? format(new Date(data?.invoice_date), "PPP")
              : ""}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Due Date: </span>
            {data?.due_date ? format(new Date(data?.due_date), "PPP") : ""}
          </div>
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">Status: </span>
            {data?.status_label}
          </div>

          {/* Financials */}
          <div className="p-1 whitespace-nowrap truncate">
            <span className="font-semibold text-primary">VAT: </span>
            {data?.vat}
          </div>
          <div className="p-1 whitespace-nowrap truncate col-span-2">
            <span className="font-semibold text-primary">Total Amount: </span>
            {data?.total_amount}
          </div>

          {/* Notes */}
          {data?.note && (
            <div className="p-1 whitespace-nowrap truncate col-span-3">
              <span className="font-semibold text-primary">Note: </span>
              {data?.note}
            </div>
          )}

          {/* Supplier Details */}
          {!!data?.supplier && (
            <>
              <div className="col-span-3 mt-4 mb-2 font-semibold text-primary">
                Supplier Details
              </div>
              <div className="col-span-3 border rounded">
                <div className="grid grid-cols-4 font-semibold">
                  <div className="border p-1">Contact Person</div>
                  <div className="border p-1">Phone</div>
                  <div className="border p-1">Email</div>
                  <div className="border p-1">TIN</div>
                </div>
                <div className="grid grid-cols-4">
                  <div className="border p-1">
                    {data?.supplier?.contact_person}
                  </div>
                  <div className="border p-1">{data?.supplier?.phone}</div>
                  <div className="border p-1">{data?.supplier?.email}</div>
                  <div className="border p-1">{data?.supplier?.tin_number}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </AppStatus>
    </AppViewDialog>
  );
};

export default InvoiceCard;
