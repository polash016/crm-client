"use client";
import DSInput from "@/components/Forms/DSInput";
import DSMultipleSelect from "@/components/Forms/DSMultipleSelect";
import DSSelect from "@/components/Forms/DSSelect";
import { useGetAllBrandsQuery } from "@/redux/api/brandApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetSubCategoriesQuery } from "@/redux/api/subCategoryApi";
import { useGetAllTenantsQuery } from "@/redux/api/tenantApi";
import { useState, useEffect } from "react";

const ProductInformation = ({
  defaultValues = {},
  showCategoryFields = true,
  showBrandField = true,
}) => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery({});
  // const {
  //   data: subCategories,
  //   isLoading: isLoadingSubCategories,
  //   isError: isErrorSubCategories,
  // } = useGetSubCategoriesQuery({});
  const {
    data: brands,
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
  } = useGetAllBrandsQuery({});

  console.log(defaultValues);

  const {
    data: tenants,
    isLoading: isLoadingTenants,
    isError: isErrorTenants,
  } = useGetAllTenantsQuery({});

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  // Set initial category and subcategories when defaultValues change
  useEffect(() => {
    if (defaultValues.categoryId && categories?.data) {
      const selectedCat = categories.data.find(
        (cat) => cat.id === defaultValues.categoryId
      );
      setSelectedCategory(selectedCat);
      setSubCategories(selectedCat?.subCategories || []);
    }
  }, [defaultValues.categoryId, categories?.data]);

  const handleCategoryChange = (categoryId) => {
    const selectedCat = categories?.data.find((cat) => cat.id === categoryId);
    setSelectedCategory(selectedCat);
    setSubCategories(selectedCat?.subCategories || []);
  };

  console.log("categories", categories);
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
      <div className=" rounded-md">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-[18px] text-slate-700 px-4 py-3 rounded-t-md font-semibold">
          Product Information
        </div>
        <div className="space-y-3 my-3 py-3">
          <div className="space-y-3">
            {/* Produt Name/ Title */}
            <div className="flex items-center px-3 justify-between gap-20 ">
              <p className=" w-56 text-sm text-[#5e5873] px-3">
                Produt Name/ Title
              </p>

              <DSInput
                label={"Enter Produt Name/ Title"}
                name={"name"}
                fullWidth={true}
                defaultValue={defaultValues.name}
              />
            </div>
            {/* Product SKU ID:*/}
            {/* <div className="flex items-center px-3 justify-between gap-20 ">
              <p className=" w-56 text-sm text-[#5e5873] px-3">
                Product SKU ID
              </p>

              <DSInput
                label={"Enter SKU ID:"}
                name={"skuId"}
                fullWidth={true}
              />
            </div> */}
            {/* Slug / Url */}
            <div className="flex items-center px-3 justify-between gap-20 ">
              <p className=" w-56 text-sm text-[#5e5873] px-3">Slug / Url</p>

              <DSInput
                label={"Enter Slug"}
                name={"slug"}
                fullWidth={true}
                defaultValue={defaultValues.slug}
              />
            </div>
            {/* Category */}
            {showCategoryFields && (
              <div className="flex items-center px-3 justify-between gap-20 ">
                <p className=" w-56 text-sm text-[#5e5873] px-3">
                  Select Categories
                </p>

                <DSSelect
                  label={"Select Type"}
                  name={`categoryId`}
                  isLoading={isLoading}
                  isError={isError}
                  options={
                    categories?.data.map((category) => ({
                      id: category.id,
                      name: category.name,
                    })) || []
                  }
                  fullWidth={true}
                  // required={true}
                  onChange={handleCategoryChange}
                  defaultValue={defaultValues.categoryId}
                />
              </div>
            )}

            {/* Sub Category */}
            {showCategoryFields && (
              <div className="flex items-center px-3 justify-between gap-20 ">
                <p className=" w-56 text-sm text-[#5e5873] px-3">
                  Select Sub Categories
                </p>

                <DSSelect
                  label={
                    subCategories.length > 0
                      ? "Select Sub Category"
                      : "No Sub Category Available"
                  }
                  name={"subCategoryId"}
                  options={subCategories.map((subCategory) => ({
                    id: subCategory.id,
                    name: subCategory.name,
                  }))}
                  fullWidth={true}
                  // required={false}
                  disabled={subCategories.length === 0}
                  defaultValue={defaultValues.subCategoryId}
                />
              </div>
            )}

            {/* Brand */}
            {showBrandField && (
              <div className="flex items-center px-3 justify-between gap-20 ">
                <p className=" w-56 text-sm text-[#5e5873] px-3">
                  Select Brand
                </p>

                <DSSelect
                  label={"Select Type"}
                  name={`brandId`}
                  isLoading={isLoadingBrands}
                  isError={isErrorBrands}
                  options={
                    brands?.data.map((category) => ({
                      id: category.id,
                      name: category.name,
                    })) || []
                  }
                  fullWidth={true}
                  // required={true}
                  defaultValue={defaultValues.brandId}
                />
              </div>
            )}
            {/* Tenant */}
            <div className="flex items-center px-3 justify-between gap-20 ">
              <p className=" w-56 text-sm text-[#5e5873] px-3">Select Tenant</p>

              <DSMultipleSelect
                label={"Select Type"}
                name={`tenantId`}
                isLoading={isLoadingTenants}
                isError={isErrorTenants}
                options={
                  tenants?.data.map((tenant) => ({
                    id: tenant.id,
                    name: tenant.name,
                  })) || []
                }
                fullWidth={true}
                defaultValue={defaultValues?.ProductTenant?.map(
                  (item) => item.tenant.id
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
