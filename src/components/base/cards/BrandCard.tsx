"use client";
import React from "react";
import AppViewDialog from "../AppViewDialog";
import { ModalType } from "@/types/global";
import { BrandFormType } from "@/app/(app)/brands/_types/brand_types";
import Image from "next/image";
import { getImageSrc } from "@/utils/getImageSrc";


type TProps = ModalType & {
  title: string;
  formData:BrandFormType;

};

const BrandCard = ({ title, open, onOpenChange, formData }: TProps) => {
  
console.log("🚀 ~ BrandCard ~ formData:", formData.data)
  return (
    <AppViewDialog title={title} open={open} onOpenChange={onOpenChange}>
      <div className="text-sm space-y-3">
         {/* Brand Image */}
        {formData.data.image && (
          <div className="flex justify-center">
            {/* <Image
              src={getImageSrc()}
              alt={formData.data.name}
              
            /> */}
          </div>
        )}

        {/* Brand Info */}
        <div className="space-y-2 text-center">
           <p>
            <strong>Name:</strong> {formData.data.name}
          </p>
           <p>
            <strong>Description:</strong> {formData.data.description}
          </p>
        </div>
      </div>
    </AppViewDialog>
  );
};

export default BrandCard;
