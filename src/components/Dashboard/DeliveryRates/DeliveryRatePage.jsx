"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@mui/material";
import { FiPlus, FiSearch } from "react-icons/fi";
import CreateDeliveryRate from "./CreateDeliveryRate";
import UpdateDeliveryRate from "./UpdateDeliveryRate";
import ActionButtons from "@/components/Shared/ActionButtons";
import { useAuth } from "@/hooks/useAuth";
import { useDebounced } from "@/redux/hooks";
import DSPagination from "../pagination/DSPagination";
import TableSkeleton from "@/components/Shared/TableSkeleton";
import {
  useDeleteDeliveryRateMutation,
  useGetAllDeliveryRatesQuery,
} from "@/redux/api/deliveryRateApi";

const DeliveryRatePage = () => {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDeliveryRate, setSelectedDeliveryRate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const query = {};
  const debouncedTerm = useDebounced({ searchQuery: searchTerm, delay: 600 });
  if (!!debouncedTerm) {
    query["searchTerm"] = searchTerm;
  }
  query["page"] = page;
  query["limit"] = limit;

  const { data, isLoading, isError, error } = useGetAllDeliveryRatesQuery({
    ...query,
  });
  const [deleteDeliveryRate] = useDeleteDeliveryRateMutation();
  const { canCreate } = useAuth();

  if (isLoading)
    return (
      <TableSkeleton
        rowCount={5}
        showImage={false}
        showActions={true}
        headerTitle="Delivery Rates"
      />
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-red-600 text-lg">
            {error?.message || "Failed to load delivery rates"}
          </p>
        </div>
      </div>
    );

  const handleDelete = async (id) => {
    try {
      const res = await deleteDeliveryRate(id).unwrap();

      toast.promise(Promise.resolve(res), {
        loading: "Deleting...",
        success: (res) => {
          if (res?.data?.id) {
            return res.message || "Delivery Rate Deleted Successfully";
          } else {
            return res.message;
          }
        },
        error: (error) => {
          console.log(error.message);
          return error?.message || "Delete failed";
        },
      });
    } catch (error) {
      console.error("Failed to delete delivery rate:", error);
      toast.error(error?.message || "Delete failed");
    }
  };

  const handleEdit = (deliveryRate) => {
    setSelectedDeliveryRate(deliveryRate);
    setEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Delivery Rates
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your delivery rates and pricing
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
                  placeholder="Search delivery rates..."
                  className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {canCreate("delivery_rates") && (
                <button
                  onClick={() => setOpen(!open)}
                  className="inline-flex items-center gap-2 cursor-pointer px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0"
                >
                  <FiPlus className="h-5 w-5" />
                  Add Delivery Rate
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Modern Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Delivery Rates
              </h2>
              <div className="text-sm text-slate-600">
                {data?.data?.length || 0} rates
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {data?.data?.length > 0 ? (
                  data.data.map((deliveryRate) => (
                    <tr
                      key={deliveryRate.id}
                      className="hover:bg-slate-50/50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {deliveryRate.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {deliveryRate.price}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-700">
                        <ActionButtons
                          resource="delivery_rates"
                          onEdit={() => handleEdit(deliveryRate)}
                          onDelete={() => handleDelete(deliveryRate.id)}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiSearch className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          No delivery rates found
                        </h3>
                        <p className="text-slate-600">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Get started by creating your first delivery rate"}
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
            totalPages={Math.ceil((data?.meta?.total || 0) / limit)}
            onPageChange={setPage}
            onLimitChange={setLimit}
            limit={limit}
          />
        </div>
        {/* Create Modal */}
        {open && <CreateDeliveryRate open={open} setOpen={setOpen} />}
        {/* Edit Modal */}
        {selectedDeliveryRate && (
          <UpdateDeliveryRate
            open={editModalOpen}
            setOpen={() => {
              setEditModalOpen(false);
              setSelectedDeliveryRate(null);
            }}
            deliveryRate={selectedDeliveryRate}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryRatePage;
