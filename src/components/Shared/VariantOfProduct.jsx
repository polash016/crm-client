"use client";

import { useGetAllProductsQuery } from "@/redux/api/productsApi";
import { Input } from "@mui/material";
import { useState } from "react";
import VariantsModal from "./VariantsModal";

const VariantOfProduct = ({ selectedProducts, SetSelectedProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetAllProductsQuery({});

  if (isLoading) return <div>Loading...</div>;

  const filteredProducts = data?.data?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 grow">
      <Input
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Product here"
        className="w-full"
      />

      <div className="max-h-48 overflow-auto space-y-1">
        {filteredProducts?.map(
          ({ id, name, sku, description, coverImg, variants }) => (
            <VariantsModal
              key={id}
              variants={variants}
              productInfo={{ name, description, coverImg }}
              selectedProducts={selectedProducts}
              SetSelectedProducts={SetSelectedProducts}
            >
              <div className="flex gap-2 border p-1 rounded">
                <div className="size-14">
                  <img
                    src={coverImg}
                    alt="product img"
                    className="w-full p-0.5"
                  />
                </div>

                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <p>{sku}</p>
                </div>
              </div>
            </VariantsModal>
          )
        )}
      </div>
    </div>
  );
};

export default VariantOfProduct;
