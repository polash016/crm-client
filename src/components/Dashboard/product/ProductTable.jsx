"use client";

import AddProductModal from "@/components/Dashboard/product/AddProductModal";
import UpdateProductModal from "@/components/Dashboard/product/UpdateProductModal";
import ActionButtons from "@/components/Shared/ActionButtons";
import TableSkeleton from "@/components/Shared/TableSkeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/api/productsApi";
import { useDebounced } from "@/redux/hooks";
import { useState } from "react";
import {
  FiEdit,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import DSPagination from "../pagination/DSPagination";

const ProductTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteProduct] = useDeleteProductMutation();
  const { canCreate, canDelete, canEdit } = useAuth();
  const [open, setOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const query = {};
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const debouncedTerm = useDebounced({ searchQuery: searchTerm, delay: 400 });
  if (!!debouncedTerm) {
    query["searchTerm"] = searchTerm;
  }

  query["page"] = page;
  query["limit"] = limit;

  const { data, isLoading, isError, error } = useGetAllProductsQuery({
    ...query,
  });

  if (isLoading) {
    return (
      <TableSkeleton
        rowCount={5}
        showImage={true}
        showActions={true}
        headerTitle="Categories"
      />
    );
  }

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-red-600 text-lg">Error loading products</p>
        </div>
      </div>
    );

  const togglePublish = (id) => {
    setProducts(
      data?.data?.map((product) =>
        product.id === id
          ? { ...product, published: !product.published }
          : product
      )
    );
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await deleteProduct(id).unwrap();
      toast.promise(Promise.resolve(res), {
        loading: "Deleting...",
        success: (res) => res?.message || "Product deleted successfully",
        error: (error) => error?.message || "Delete failed",
      });
    } catch (error) {
      toast.error(error?.message || "Delete failed");
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

  return (
    <div className="min-h-screen p-6 ">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Products
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your product catalog and inventory
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add Button */}
              {canCreate("products") && (
                <button
                  onClick={() => setOpen(!open)}
                  className="inline-flex items-center gap-2 cursor-pointer px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0"
                >
                  <FiPlus className="h-5 w-5" />
                  Add Product
                </button>
              )}

              {open && <AddProductModal open={open} setOpen={setOpen} />}
              {updateModalOpen && (
                <UpdateProductModal
                  open={updateModalOpen}
                  setOpen={setUpdateModalOpen}
                  product={selectedProduct}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Products</h2>
              {/* <div className="text-sm text-slate-600">
                {data?.data?.length || 0} products
              </div> */}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category & Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Variants
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>

                  {(canEdit("products") || canDelete("products")) && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {data?.data?.length > 0 ? (
                  data?.data?.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 transition-colors duration-200 group"
                    >
                      {/* Product Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                              src={
                                product?.coverImg || "/placeholder-image.jpg"
                              }
                              alt={product.name}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              SKU: {product.sku}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {product.shortDesc?.substring(0, 50) ||
                                "No description"}
                              ...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-slate-600">
                              Category:
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                              {product.category?.name || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-slate-600">
                              Brand:
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                              {product.brand?.name || "N/A"}
                            </span>
                          </div>
                          {product.subCategory && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-slate-600">
                                Sub:
                              </span>
                              <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                                {product.subCategory.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Variants */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-slate-700">
                            {product.variants?.length || 0} variants
                          </span>
                          {product.variants
                            ?.slice(0, 2)
                            .map((variant, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-1"
                              >
                                <span className="text-xs text-slate-500">
                                  {variant.measurement &&
                                    ` ${variant.measurement}`}
                                  {variant.size && `${variant.size}`}

                                  {variant.color && ` - ${variant.color}`}
                                </span>
                              </div>
                            ))}
                          {product.variants?.length > 2 && (
                            <span className="text-xs text-slate-400">
                              +{product.variants.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                product.status === "ACTIVE"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-slate-700">
                              {product.status || "INACTIVE"}
                            </span>
                          </div>
                          <button
                            onClick={() => togglePublish(product.id)}
                            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                              product.published
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {product.published ? (
                              <FiEye className="h-3 w-3 mr-1" />
                            ) : (
                              <FiEyeOff className="h-3 w-3 mr-1" />
                            )}
                            {product.published ? "Published" : "Unpublished"}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <ActionButtons
                            resource="products"
                            onEdit={() => handleEditProduct(product)}
                            onDelete={() => handleDeleteProduct(product.id)}
                            size="sm"
                          />
                          {/* <button
                            className="mr-4 py-1 px-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white cursor-pointer shadow hover:shadow-md transition-all duration-200"
                            onClick={() => handleEditProduct(product)}>
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="py-1 px-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl text-white cursor-pointer shadow hover:shadow-md transition-all duration-200">
                            <MdDelete />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiSearch className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          No products found
                        </h3>
                        <p className="text-slate-600">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Get started by creating your first product"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <DSPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={setLimit}
            total={data?.meta?.total}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
