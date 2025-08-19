"use client";
import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useFormContext, Controller } from "react-hook-form";
import DSInput from "@/components/Forms/DSInput";

const ProductDescription = ({ placeholder, defaultValues = {} }) => {
  const editor = useRef(null);
  const { control } = useFormContext();

  const config = useMemo(
    () => ({
      height: 300,
      readonly: false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-[18px] text-slate-700 px-4 py-3 rounded-t-xl font-semibold">
        Product Description
      </div>

      {/* Short Description */}
      <div className="flex items-center px-3 justify-between gap-20">
        <p className="w-56 text-sm text-[#5e5873] px-3">Short Description</p>
        <DSInput
          label={"Enter Short Description"}
          name={`shortDesc`}
          fullWidth={true}
          defaultValue={defaultValues.shortDesc}
        />
      </div>
      {/* Long Description */}
      <div className="flex items-center px-3 justify-between gap-20">
        <p className="w-56 text-sm text-[#5e5873] px-3">Long Description</p>
        <DSInput
          label={"Enter Long Description"}
          name={`description`}
          fullWidth={true}
          defaultValue={defaultValues.description}
        />
      </div>
    </div>
  );
};

export default ProductDescription;
