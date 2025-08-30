import { baseApi } from "./baseApi";

const leadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeads: build.query({
      query: (params) => ({
        url: "/leads",
        method: "GET",
        params: params,
      }),
      providesTags: ["leads"],
    }),
    getLeadsById: build.query({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["leads"],
    }),

    createLeads: build.mutation({
      query: (data) => ({
        url: "/leads/upload-csv",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: ["leads"],
    }),

    createLead: build.mutation({
      query: (data) => ({
        url: "/leads/create-lead",
        method: "POST",
        data,
      }),
      invalidatesTags: ["leads"],
    }),

    updateLeads: build.mutation({
      query: ({ id, data }) => ({
        url: `/leads/${id}`,
        method: "PUT",
        contentType: "multipart/form-data",
        data: data?.data,
      }),
      invalidatesTags: ["leads"],
    }),

    deleteLeads: build.mutation({
      query: (id) => ({
        url: `/leads/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leads"],
    }),

    bulkDeleteLeads: build.mutation({
      query: (ids) => ({
        url: "/leads/bulk",
        method: "DELETE",
        data: { ids },
      }),
      invalidatesTags: ["leads"],
    }),

    assignOrder: build.mutation({
      query: ({ orderId, assignedToUserId, adminUserId }) => ({
        url: `/orders/${orderId}/assign`,
        method: "POST",
        data: { assignedToUserId, adminUserId },
      }),
      invalidatesTags: ["leads"],
    }),

    // Assign a single lead to a user
    assignLead: build.mutation({
      query: ({ leadId, assignedToId }) => ({
        url: `/leads/${leadId}/assign`,
        method: "PATCH",
        data: { assignedToId },
      }),
      invalidatesTags: ["leads"],
    }),

    // Bulk assign multiple leads to a user
    bulkAssignLeads: build.mutation({
      query: ({ leadIds, assignedToId }) => ({
        url: "/leads/bulk-assign",
        method: "PATCH",
        data: { leadIds, assignedToId },
      }),
      invalidatesTags: ["leads"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetLeadsQuery,
  useGetLeadsByIdQuery,
  useCreateLeadsMutation,
  useCreateLeadMutation,
  useUpdateLeadsMutation,
  useDeleteLeadsMutation,
  useAssignOrderMutation,
  useAssignLeadMutation,
  useBulkAssignLeadsMutation,
  useBulkDeleteLeadsMutation,
} = leadsApi;
