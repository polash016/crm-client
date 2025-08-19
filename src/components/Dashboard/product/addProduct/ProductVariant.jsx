"use client";
import DSInput from "@/components/Forms/DSInput";
import DSSelect from "@/components/Forms/DSSelect";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const ProductVariant = ({ defaultValues = {}, showExistingLabels = false }) => {
  const [variants, setVariants] = useState(() => {
    if (defaultValues.variants && defaultValues.variants.length > 0) {
      return defaultValues.variants.map((variant, index) => ({
        uiId: `server-${variant.id || index}`,
        id: variant.id, // Only set for existing variants
        quantity: variant.Inventory?.quantity || variant.quantity || "",
        size: variant.size || "",
        measurement: variant.measurement || "",
        color: variant.color || "",
        colorCode: variant.colorCode || "",
        price: variant.price || "",
        discountPrice: variant.discountPrice || "",
        weight: variant.weight || "",
      }));
    }
    return [
      {
        uiId: `new-${Date.now()}`,
        quantity: "",
        size: "",
        measurement: "",
        color: "",
        colorCode: "",
        price: "",
        discountPrice: "",
        weight: "",
      },
    ];
  });

  const handleAddMore = () => {
    setVariants((prev) => [
      ...prev,
      {
        uiId: `new-${Date.now()}`,
        quantity: "",
        size: "",
        measurement: "",
        color: "",
        colorCode: "",
        price: "",
        discountPrice: "",
        weight: "",
      },
    ]);
  };

  const size = [
    { id: "ml", name: "Ml" },
    { id: "gm", name: "Gram" },
    { id: "kg", name: "KG" },
    { id: "cap", name: "Capsule" },
  ];

  const handleRemove = (uiId) => {
    setVariants((prev) => prev.filter((variant) => variant.uiId !== uiId));
  };

  const handleInputChange = (uiId, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.uiId === uiId ? { ...variant, [field]: value } : variant
      )
    );
  };

  const getVariantData = () => {
    return variants;
  };

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
        <div className="rounded-none">
          <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-[18px] text-slate-700 px-4 py-3 rounded-t-xl font-semibold">
            Product Variant
          </div>

          {variants.map((variant, index) => (
            <div
              key={variant.uiId}
              className="relative space-y-3 mt-6 pb-3 border border-gray-200 rounded-lg p-6"
            >
              {/* Show if this is an existing variant */}
              {showExistingLabels && variant.id && (
                <div className="absolute -top-3 left-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                  Existing Variant
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(variant.uiId)}
                className="absolute -top-2 right-4 bg-gray-100 rounded-full p-1 hover:bg-red-100 transition"
              >
                <IoMdClose
                  size={16}
                  className="text-gray-500 hover:text-red-500"
                />
              </button>

              <div className="flex items-center mt-1 px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">Stock Alert</p>
                <DSInput
                  label={"Stock alert number"}
                  name={`variants[${index}].quantity`}
                  fullWidth={true}
                  defaultValue={variant.quantity}
                  type="number"
                />
              </div>

              {defaultValues && variant.id && (
                <div className="flex items-center mt-1 px-3 justify-between gap-20">
                  <DSInput
                    label={"Variant ID"}
                    name={`variants[${index}].id`}
                    fullWidth={true}
                    defaultValue={variant.id}
                    sx={{ display: "none" }}
                  />
                </div>
              )}

              {/* <div className="flex items-start px-3 justify-start gap-8">
                <p className="w-56 text-sm text-[#5e5873] px-3 my-auto">
                  Variant Images
                </p>
                <div className="">
                  <DSFilesWithPreview
                    name={`variants[${index}].variantImages`}
                    label={`Variant Images`}
                    sx={{
                      cursor: "pointer",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "12px",
                      backgroundColor: "#f8f9fa",
                      aspectRatio: "1 / 1",
                      width: "100%",
                      height: "auto",
                      minHeight: "126px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      position: "relative",
                    }}
                  />
                </div>
              </div> */}

              <div className="flex items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">Size</p>
                {/* <DSInput
                  label={"Size"}
                  name={`variants[${index}].size`}
                  fullWidth={true}
                  defaultValue={variant.size}
                /> */}

                <DSSelect
                  name={`variants[${index}].size`}
                  options={size}
                  fullWidth={true}
                  // required={true}
                  defaultValue={variant?.size}
                />
              </div>

              <div className="flex items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">Measurement</p>
                <DSInput
                  label={"Measurement"}
                  name={`variants[${index}].measurement`}
                  fullWidth={true}
                  defaultValue={variant.measurement}
                  // required={true}
                />
              </div>

              <div className="flex items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">Color</p>
                <DSInput
                  label={"Enter Color"}
                  name={`variants[${index}].color`}
                  fullWidth={true}
                  defaultValue={variant.color}
                />
              </div>

              <div className="flex items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">Color Code</p>
                <DSInput
                  label={"Enter Color Code"}
                  name={`variants[${index}].colorCode`}
                  fullWidth={true}
                  defaultValue={variant.colorCode}
                />
              </div>

              <div className="flex items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">
                  Regular Price
                </p>
                <DSInput
                  label={"Enter Regular Price"}
                  name={`variants[${index}].price`}
                  fullWidth={true}
                  defaultValue={variant.price}
                  type="number"
                />
              </div>

              <div className="flex items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">
                  Discount Price
                </p>
                <div className="flex w-full gap-3">
                  <DSInput
                    label={"Enter Discount Price"}
                    name={`variants[${index}].discountPrice`}
                    fullWidth={true}
                    defaultValue={variant.discountPrice}
                    type="number"
                  />
                </div>
              </div>

              <div className="flex pb-3 items-center px-3 justify-between gap-20">
                <p className="w-56 text-sm text-[#5e5873] px-3">Weight</p>
                <DSInput
                  label={"Enter Weight"}
                  name={`variants[${index}].weight`}
                  required={false}
                  fullWidth={true}
                  defaultValue={variant.weight}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-center my-4">
            <button
              type="button"
              onClick={handleAddMore}
              className="btn bg-gradient-to-r from-blue-100 to-blue-300 text-gray-600 rounded-md px-3 py-1.5 mb-4 text-base font-medium transition-all shadow-sm hover:from-blue-200 hover:to-blue-400"
            >
              Add More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductVariant;
