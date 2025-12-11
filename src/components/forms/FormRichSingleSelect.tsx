// // "use client";

// // import { useState } from "react";
// // import {
// //   ArchiveRestoreIcon,
// //   ChevronDownIcon,
// //   PlusIcon,
// //   Share2Icon,
// //   TrashIcon,
// // } from "lucide-react";

// // import { Button } from "@/components/ui/button";
// // import {
// //   DropdownMenu,
// //   DropdownMenuCheckboxItem,
// //   DropdownMenuContent,
// //   DropdownMenuGroup,
// //   DropdownMenuItem,
// //   DropdownMenuPortal,
// //   DropdownMenuRadioGroup,
// //   DropdownMenuRadioItem,
// //   DropdownMenuSeparator,
// //   DropdownMenuShortcut,
// //   DropdownMenuSub,
// //   DropdownMenuSubContent,
// //   DropdownMenuSubTrigger,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import ErrorText from "../base/ErrorText";

// // export default function FormRichSingleSelect() {
// //   const [framework, setFramework] = useState("nextjs");
// //   const [emailNotifications, setEmailNotifications] = useState(false);
// //   const [pushNotifications, setPushNotifications] = useState(true);

// //   return (
// //     <DropdownMenu>
// //       <DropdownMenuTrigger asChild className="w-full">
// //         <Button variant="outline" className="w-full justify-between">
// //           Select One
// //           <ChevronDownIcon
// //             className="-me-1 opacity-60"
// //             size={16}
// //             aria-hidden="true"
// //           />
// //         </Button>
// //       </DropdownMenuTrigger>
// //       <DropdownMenuContent className="w-md" align="start">
// //         <DropdownMenuGroup>
// //           <DropdownMenuSub>
// //             <DropdownMenuSubTrigger inset>Framework</DropdownMenuSubTrigger>
// //             <DropdownMenuPortal>
// //               <DropdownMenuSubContent>
// //                 <DropdownMenuRadioGroup
// //                   value={framework}
// //                   onValueChange={setFramework}
// //                 >
// //                   <DropdownMenuRadioItem value="nextjs">
// //                     Next.js
// //                   </DropdownMenuRadioItem>
// //                   <DropdownMenuRadioItem value="sveltekit" disabled>
// //                     SvelteKit
// //                   </DropdownMenuRadioItem>
// //                   <DropdownMenuRadioItem value="remix">
// //                     Remix
// //                   </DropdownMenuRadioItem>
// //                   <DropdownMenuRadioItem value="astro">
// //                     Astro
// //                   </DropdownMenuRadioItem>
// //                 </DropdownMenuRadioGroup>
// //               </DropdownMenuSubContent>
// //             </DropdownMenuPortal>
// //           </DropdownMenuSub>
// //           <DropdownMenuSub>
// //             <DropdownMenuSubTrigger inset>Notifications</DropdownMenuSubTrigger>
// //             <DropdownMenuPortal>
// //               <DropdownMenuSubContent>
// //                 <DropdownMenuCheckboxItem
// //                   checked={emailNotifications}
// //                   onCheckedChange={setEmailNotifications}
// //                 >
// //                   Email
// //                 </DropdownMenuCheckboxItem>
// //                 <DropdownMenuCheckboxItem
// //                   checked={pushNotifications}
// //                   onCheckedChange={setPushNotifications}
// //                 >
// //                   Push
// //                 </DropdownMenuCheckboxItem>
// //               </DropdownMenuSubContent>
// //             </DropdownMenuPortal>
// //           </DropdownMenuSub>
// //         </DropdownMenuGroup>
// //       </DropdownMenuContent>
// //     </DropdownMenu>
// //   );
// // }
// "use client";

// import { useId } from "react";
// import { Controller, Control, FieldErrors } from "react-hook-form";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuSub,
//   DropdownMenuSubTrigger,
//   DropdownMenuSubContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { ChevronDownIcon } from "lucide-react";
// import ErrorText from "../base/ErrorText"; // Update path if needed

// // --------------------
// // Types
// // --------------------
// export type RichOption = {
//   label: string;
//   value: string;
//   children?: RichOption[];
// };

// type Props = {
//   name: string;
//   label?: string;
//   placeholder?: string;
//   options: RichOption[];
//   control: Control<any>;
//   errors: FieldErrors;
//   className?: string;
//   disabled?: boolean;
// };

// export default function FormRichSingleSelect({
//   name,
//   label,
//   placeholder = "Select option",
//   options,
//   control,
//   errors,
//   className = "",
//   disabled = false,
// }: Props) {
//   const id = useId();
//   const hasError = !!errors[name];

//   return (
//     <div className={`w-full *:not-first:mt-1.5 ${className}`}>
//       {label && <Label htmlFor={id}>{label}</Label>}
//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 className={`w-full capitalize !bg-transparent justify-between ${
//                   hasError ? "border-red-500" : ""
//                 }`}
//                 disabled={disabled}
//               >
//                 {field.value?.label || field.value || placeholder}
//                 <ChevronDownIcon className="ms-2 h-4 w-4 opacity-50" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-sm">
//               <DropdownMenuGroup>
//                 {options.map((group) =>
//                   group.children ? (
//                     <DropdownMenuSub key={group.value}>
//                       <DropdownMenuSubTrigger inset>
//                         {group.label}
//                       </DropdownMenuSubTrigger>
//                       <DropdownMenuSubContent>
//                         <DropdownMenuRadioGroup
//                           value={field.value}
//                           onValueChange={(val) => field.onChange(val)}
//                         >
//                           {group.children.map((item) => (
//                             <DropdownMenuRadioItem
//                               key={item.value}
//                               value={item.value}
//                             >
//                               {item.label}
//                             </DropdownMenuRadioItem>
//                           ))}
//                         </DropdownMenuRadioGroup>
//                       </DropdownMenuSubContent>
//                     </DropdownMenuSub>
//                   ) : (
//                     <DropdownMenuRadioItem
//                       key={group.value}
//                       value={group.value}
//                       onSelect={() => field.onChange(group.value)}
//                     >
//                       {group.label}
//                     </DropdownMenuRadioItem>
//                   )
//                 )}
//               </DropdownMenuGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       />
//       {hasError && <ErrorText text={errors[name]?.message as string} />}
//     </div>
//   );
// }
"use client";

import { useId } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import ErrorText from "../base/ErrorText";

// --------------------
// Types
// --------------------
export type RichOption = {
  label: string;
  value: string;
  children?: RichOption[];
};

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: RichOption[];
  control: Control<any>;
  errors: FieldErrors;
  className?: string;
  disabled?: boolean;
};

export default function FormRichSingleSelect({
  name,
  label,
  placeholder = "Select option",
  options,
  control,
  errors,
  className = "",
  disabled = false,
}: Props) {
  const id = useId();
  const hasError = !!errors[name];

  return (
    <div className={`w-full *:not-first:mt-1.5 ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValue = field.value?.value || "";

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full capitalize !bg-transparent justify-between ${
                    hasError ? "border-red-500" : ""
                  }`}
                  disabled={disabled}
                >
                  {field.value?.label || placeholder}
                  <ChevronDownIcon className="ms-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-sm z-[100]">
                <DropdownMenuGroup>
                  {options.map((group) =>
                    group.children ? (
                      <DropdownMenuSub key={group.value}>
                        <DropdownMenuSubTrigger inset>
                          {group.label}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup
                            value={selectedValue}
                            onValueChange={(val) => {
                              const found = group.children?.find(
                                (item) => item.value === val
                              );
                              if (found) field.onChange(found);
                            }}
                          >
                            {group.children.map((item) => (
                              <DropdownMenuRadioItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuRadioItem
                        key={group.value}
                        value={group.value}
                        onSelect={() => field.onChange(group)}
                      >
                        {group.label}
                      </DropdownMenuRadioItem>
                    )
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }}
      />
      {hasError && <ErrorText text={errors[name]?.message as string} />}
    </div>
  );
}
