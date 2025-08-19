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
import { useCreateProductMutation } from "@/redux/api/productsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createProductSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),
  slug: z.string({ required_error: "Slug is required" }),
  categoryId: z
    .string({ required_error: "Category is required" })
    .nonempty("Category is required"),
  subCategoryId: z
    .string({ required_error: "Subcategory is required" })
    .nonempty("Subcategory is required"),
  brandId: z
    .string({ required_error: "Brand is required" })
    .nonempty("Brand is required"),
  shortDesc: z
    .string()
    .max(250, "Short description must not exceed 250 characters")
    .optional(),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters"),
  videoLink: z.string().url("Invalid video URL").optional(),
  coverImg: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      "Max file size allowed is 2MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
  files: z
    .array(
      z
        .any()
        .refine(
          (file) => !file || file?.size <= MAX_FILE_SIZE,
          "Max file size allowed is 2MB"
        )
        .refine(
          (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported"
        )
    )
    .optional(),
  tenantId: z
    .array(z.string())
    .min(1, "At least one tenant must be selected")
    .max(10, "Cannot select more than 10 tenants"),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        quantity: z
          .string({ required_error: "Quantity is required" })
          .min(1, "Quantity is required")
          .transform((val) => Number(val))
          .refine((val) => val >= 0, "Quantity must be positive"),
        size: z
          .string({ required_error: "Size is required" })
          .min(1, "Size is required"),
        measurement: z
          .string({ required_error: "Measurement is required" })
          .min(1, "Measurement is required"),
        price: z
          .string({ required_error: "Price is required" })
          .min(1, "Price is required")
          .transform((val) => Number(val))
          .refine((val) => val >= 0, "Price must be positive"),
        discountPrice: z
          .string()
          .transform((val) => (val ? Number(val) : undefined))
          .optional(),
        weight: z
          .string()
          .transform((val) => (val ? Number(val) : undefined))
          .optional(),
        color: z.string().optional(),
        colorCode: z.string().optional(),
      })
    )
    .min(1, "At least one variant is required"),
  deliveryRateId: z.string({ required_error: "Delivery rate is required" }),
  seo: z
    .object({
      title: z
        .string()
        .max(60, "Meta title must not exceed 60 characters")
        .optional(),
      keywords: z
        .array(z.string())
        .max(10, "Maximum 10 keywords allowed")
        .optional(),
      description: z
        .string()
        .max(160, "Meta description must not exceed 160 characters")
        .optional(),
    })
    .optional(),
});

const AddProductModal = ({ open, setOpen }) => {
  const { reset } = useForm();
  const [createProduct, { isLoading, isError }] = useCreateProductMutation();

  const handleSubmit = (data) => {
    const formData = new FormData();
    console.log(data);

    const { coverImg, files, ...rest } = data;

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

    console.log(data);
    const res = createProduct(formData).unwrap();

    toast.promise(res, {
      loading: "Creating...",
      success: (res) => {
        if (res?.data?.id) {
          setOpen(!open);
          reset();
          return res?.message || "Product created successfully";
        } else {
          return res?.message;
        }
      },
      error: (error) => {
        console.log(error.message);
        return error?.message || "Something went wrong";
      },
    });
  };
  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title={
        <div className="bg-gradient-to-r from-blue-200 via-blue-10 to-blue-50 text-slate-700 px-4 py-3 rounded-2xl font-semibold text-center">
          Create Product
        </div>
      }
      fullWidth={true}
      width="90vw"
      sx={{ width: "100%", mx: "auto", height: "full" }}>
      <DSForm
        onSubmit={handleSubmit}
        resolver={zodResolver(createProductSchema)}
        defaultValues={{
          name: "",
          categoryId: "",
          subCategoryId: "",
          brandId: "",
          shortDesc: "",
          description: "",
          tenantId: [],
          variants: [
            {
              id: Date.now().toString(),
              quantity: "",
              size: "",
              measurement: "",
              color: "",
              colorCode: "",
              price: "",
              discountPrice: "",
              weight: "",
            },
          ],
          seo: {
            title: "",
            keywords: [],
            description: "",
          },
        }}
        className="space-y-8">
        <div className="space-y-8">
          {/* Product Information Section */}
          <div className="rounded-2xl border border-white/20 shadow-sm p-6">
            <ProductInformation
              showCategoryFields={true}
              showBrandField={true}
            />
          </div>

          {/* Media Section */}
          <div className="rounded-2xl border border-white/20 shadow-sm p-6">
            <MediaSection
              mediaHeight={180}
              multiImageHeight={140}
              multiImageWidth={140}
            />
          </div>

          {/* Product Variant Section */}
          <div className="rounded-2xl border border-white/20 shadow-sm p-6">
            <ProductVariant showExistingLabels={false} />
          </div>

          {/* Product Description Section */}
          <div className="rounded-2xl border border-white/20 shadow-sm p-6">
            <ProductDescription />
          </div>

          {/* Delivery Type Section */}
          <div className="rounded-2xl border border-white/20 shadow-sm p-6">
            <DeliveryType />
          </div>

          {/* SEO Section */}
          <div className="rounded-2xl border border-white/20 shadow-sm p-6">
            <SeoSection />
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="inline-flex items-center cursor-pointer gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0">
              Publish
            </button>
          </div>
        </div>
      </DSForm>
    </DSModal>
  );
};

export default AddProductModal;
