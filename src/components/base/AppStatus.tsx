import Loading from "@/app/loading";
import React from "react";
import { Spinner } from "../ui/shadcn-io/spinner";
type AppStatusProps = {
  status: "pending" | "error" | "success";
  is_data: boolean;
  children: React.ReactNode;
};
export default function AppStatus({
  status,
  is_data,
  children,
}: AppStatusProps) {
  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-[60svh]">
        {" "}
        <Spinner key="bars" variant="bars" />
      </div>
    );
  } else if (status === "error") {
    return <div className="text-center">Error loading data</div>;
  } else if (status == "success" && !is_data) {
    return (
      <div className="text-center">No data found. Please create one first.</div>
    );
  }
  return children;
}
