// export default function Loading() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
//     </div>
//   );
// }

"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 h-svh">
      <Spinner key="bars" variant="bars" />
    </div>
  );
}
