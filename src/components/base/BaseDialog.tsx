// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import { cn } from "@/lib/utils";
// type TProps = {
//   component_props?: {
//     content?: React.ComponentProps<typeof DialogContent>;
//     header?: React.ComponentProps<typeof DialogHeader>;
//     title?: React.ComponentProps<typeof DialogTitle>;
//     description?: React.ComponentProps<typeof DialogDescription>;
//   };
//   title?: string;
//   description?: string;
// } & React.ComponentProps<typeof Dialog>;
// export default function BaseDialog({
//   title = "",
//   description = "",
//   component_props,
//   children,
//   ...props
// }: TProps) {
//   return (
//     <Dialog {...props}>
//       <div className="p-2">
//         <DialogContent autoFocus={false} {...component_props?.content}>
//           <DialogHeader
//             {...component_props?.header}
//             className={cn(
//               "space-y-0 pb-2 text-left border-b",
//               component_props?.header?.className
//             )}
//           >
//             <DialogTitle {...component_props?.title}>{title}</DialogTitle>
//             <DialogDescription {...component_props?.description}>
//               {description}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="max-h-96 overflow-y-auto">{children}</div>
//         </DialogContent>
//       </div>
//     </Dialog>
//   );
// }
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

type TProps = {
  component_props?: {
    content?: React.ComponentProps<typeof DialogContent>;
    header?: React.ComponentProps<typeof DialogHeader>;
    title?: React.ComponentProps<typeof DialogTitle>;
    description?: React.ComponentProps<typeof DialogDescription>;
  };
  title?: string;
  description?: string;
} & React.ComponentProps<typeof Dialog>;

export default function BaseDialog({
  title = "",
  description = "",
  component_props,
  children,
  ...props
}: TProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        {...component_props?.content}
        className={cn(
          "outline-0 flex flex-col gap-0 p-0 sm:max-h-[min(700px,80vh)] md:max-h-[min(750px,80vh)] lg:max-h-[min(800px,80vh)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl",
          component_props?.content?.className
        )}
      >
        <DialogHeader
          {...component_props?.header}
          className={cn(
            "space-y-0 text-left border-b px-6 py-4",
            component_props?.header?.className
          )}
        >
          {title && (
            <DialogTitle
              {...component_props?.title}
              className={cn("text-base", component_props?.title?.className)}
            >
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription {...component_props?.description}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
