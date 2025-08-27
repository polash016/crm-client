"use client";
import DeliveryType from "@/components/Dashboard/product/addProduct/DeliveryType";
import MediaSection from "@/components/Dashboard/product/addProduct/MediaSection";
import OfferSetup from "@/components/Dashboard/product/addProduct/OfferSetup";
import ProductDescription from "@/components/Dashboard/product/addProduct/ProductDescription";
import ProductInformation from "@/components/Dashboard/product/addProduct/ProductInformation";
import ProductVariant from "@/components/Dashboard/product/addProduct/ProductVariant";
import SeoSection from "@/components/Dashboard/product/addProduct/SeoSection";
import DSForm from "@/components/Forms/DSForm";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { useUpdateProductMutation } from "@/redux/api/productsApi";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateProductModal = ({ open, setOpen, product }) => {
  const { reset } = useForm();
  const [updateProduct, { isLoading, isError }] = useUpdateProductMutation();

  // Set default values when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        slug: product.slug || "",
        categoryId: product.categoryId || "",
        subCategoryId: product.subCategoryId || "",
        brandId: product.brandId || "",
        tenantId: product.ProductTenant || [],
        shortDesc: product.shortDesc || "",
        description: product.description || "",
        videoLink: product.videoLink || "",
        deliveryRateId: product.deliveryRates || "",
        "seo.title": product.seo?.title || "",
        "seo.keywords": product.seo?.keywords || [],
        "seo.description": product.seo?.description || "",
        variants:
          product.variants?.map((variant, index) => ({
            id: variant?.id,
            quantity: variant.Inventory?.quantity ?? "",
            size: variant.size || "",
            measurement: variant.measurement || "",
            color: variant.color || "",
            colorCode: variant.colorCode || "",
            price: variant.price ?? "",
            discountPrice: variant.discountPrice ?? "",
            weight: variant.weight ?? "",
          })) || [],
      });
    }
  }, [product, reset]);

  const handleSubmit = (data) => {
    if (!product?.id) {
      toast.error("Product ID is required for update");
      return;
    }

    const formData = new FormData();

    const { coverImg, files, ...rest } = data;

    const modData = rest?.variants?.map((variant) => {
      if (!variant.id) {
        variant.quantity = Number(variant.quantity);
        variant.price = Number(variant.price);
        variant.discountPrice = Number(variant.discountPrice);
        // variant.weight = Number(variant.weight);
      }

      return variant;
    });

    rest.variants = modData;

    formData.append("data", JSON.stringify(rest));

    if (coverImg) {
      formData.append("coverImg", coverImg);
    }

    // Append files
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const res = updateProduct({ id: product.id, data: formData }).unwrap();

    toast.promise(res, {
      loading: "Updating...",
      success: (res) => {
        if (res?.data?.id) {
          setOpen(!open);
          reset();
          return res?.message || "Product updated successfully";
        } else {
          return res?.message;
        }
      },
      error: (error) => {
        return error?.message || "Something went wrong";
      },
    });
  };

  if (!product) {
    return null;
  }

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title="Update Product"
      sx={{ width: "100%", mx: "auto" }}
    >
      <DSForm onSubmit={handleSubmit}>
        {/* Product Information Section */}
        <ProductInformation
          defaultValues={product}
          showCategoryFields={true}
          showBrandField={true}
        />

        {/* Media Section */}
        <MediaSection defaultValues={product} />

        {/* Product Information Stock */}
        <ProductVariant defaultValues={product} showExistingLabels={true} />

        {/* Product Description Section */}
        <ProductDescription defaultValues={product} />

        {/* Delivery Type Section */}
        <DeliveryType defaultValues={product} />

        {/* Offer Setup Section */}
        {/* <OfferSetup /> */}

        {/* SEO Section */}
        <SeoSection defaultValues={product} />

        <div className="flex justify-center pt-6 gap-4">
          <button
            type="submit"
            className="inline-flex items-center cursor-pointer gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0"
          >
            Update Product
          </button>
        </div>
      </DSForm>
    </DSModal>
  );
};

export default UpdateProductModal;
