"use client";

import { Box, Modal } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "30px",
  left: "50%",
  transform: "translate(-50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const VariantsModal = ({
  children,
  variants = [],
  productInfo,
  selectedProducts,
  SetSelectedProducts,
}) => {
  const [open, setOpen] = useState(false);

  const handleVariantSelect = (variant) => {
    SetSelectedProducts((prev) =>
      prev.some((v) => v.Inventory.variantId === variant.Inventory.variantId)
        ? prev.filter(
            (v) => v.Inventory.variantId !== variant.Inventory.variantId
          )
        : [...prev, variant]
    );
  };

  console.log(variants);

  return (
    <div>
      <div onClick={() => setOpen(true)}>{children}</div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="overflow-y-auto"
      >
        <Box sx={style}>
          <div className="space-y-3 overflow-auto">
            {variants.map((variant, idx) => {
              const selected = selectedProducts.some(
                (v) => v.Inventory.variantId === variant.Inventory.variantId
              );

              return (
                <div
                  key={variant.Inventory.variantId}
                  onClick={() =>
                    handleVariantSelect({ ...productInfo, ...variant })
                  }
                  className={`p-2 cursor-pointer space-y-1 border ${
                    selected ? "border-green-500" : "border-gray-300"
                  }`}
                >
                  <p>SKU : {variant.Inventory.sku}</p>
                  <p>Quantity: {variant.Inventory.quantity}</p>
                  <p>Price: {variant.price} Tk</p>
                  <p>Discount Price: {variant.discountPrice} Tk</p>

                  <div className="flex gap-0.5">
                    <p>Measurment : {variant.measurment || "N/A"}</p>,
                    <p>Size: {variant.size || "N/A"}</p>
                  </div>

                  <p>Dimensions: {variant.dimensions || "N/A"}</p>
                  <p>Weight: {variant.weight || "N/A"}</p>

                  <div className="flex gap-0.5">
                    <p>Color: {variant.color || "N/A"}</p>,
                    <p>Color Code: {variant.colorCode || "N/A"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default VariantsModal;
