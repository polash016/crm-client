"user client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/redux/api/userApi";
import { useGetAllRolesQuery } from "@/redux/api/rolesApi";
import ModernTable from "@/components/Shared/ModernTable";
import ResponsiveContainer from "@/components/Shared/ResponsiveContainer";
import ActionButtons from "@/components/Shared/ActionButtons";
import UserCreateModal from "./UserCreateModal";
import UserUpdateModal from "./UserUpdateModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const UserTable = () => {
  const { canCreate } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleCreateUser = () => setCreateModalOpen(true);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleViewUser = (user) => {
    setModalUser(user);
    setDetailsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const res = deleteUser(user.id).unwrap();

    toast.promise(Promise.resolve(res), {
      loading: "Deleting...",
      success: (res) => {
        if (res?.data?.id) {
          return res?.message || "User deleted successfully";
        }
        return res?.message || "User deleted";
      },
      error: (error) => error?.message || "Something went wrong",
    });
  };

  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const rows = usersData?.data || [];

  const columns = [
    {
      id: "name",
      label: "Name",
      render: (row) => {
        const firstName = row?.profile?.firstName || "";
        const lastName = row?.profile?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || row?.name || "-";
        const profileImg = row?.profile?.profileImg || "";
        const initials =
          `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
          (fullName && fullName[0] ? fullName[0].toUpperCase() : "U");
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={profileImg}
              alt={fullName}
              sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontSize: "0.75rem" }}
              >
                ID: {row?.id || "-"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    { id: "email", label: "Email", render: (row) => row?.email || "-" },
    { id: "role", label: "Role", render: (row) => row?.role?.name || "-" },
    {
      id: "info",
      label: "Info",
      render: (row) => (
        <Box sx={{ textAlign: "center" }}>
          <button
            onClick={() => handleViewUser(row)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "10px 16px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1.05)";
              e.target.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>View</span>
          </button>
        </Box>
      ),
    },
  ];

  return (
    <ResponsiveContainer>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
            >
              Users
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Manage your employees and user accounts
            </Typography>
          </Box>
          {canCreate("user") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateUser}
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                },
                px: 3,
                py: 1,
              }}
            >
              Add User
            </Button>
          )}
        </Box>

        <ModernTable
          title="Users"
          subtitle={`${rows.length} users`}
          columns={columns}
          data={rows}
          loading={usersLoading}
          customActions
          renderActions={(row) => (
            <ActionButtons
              resource="users"
              onEdit={() => handleEditUser(row)}
              onDelete={() => handleDeleteUser(row)}
              size="sm"
            />
          )}
          emptyMessage="No users found"
        />

        <UserCreateModal
          open={createModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={() => refetchUsers()}
        />
        <UserUpdateModal
          open={updateModalOpen}
          onClose={handleCloseUpdateModal}
          onSuccess={() => refetchUsers()}
          user={selectedUser}
        />

        <Dialog
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="p" sx={{ fontWeight: 600, color: "#1565c0" }}>
              User Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            {modalUser ? (
              <Box component="ul" sx={{ p: 1, m: 0, listStyle: "none" }}>
                <Box
                  component="li"
                  sx={{ fontWeight: 600, color: "#334155", mb: 1 }}
                >
                  Name:{" "}
                  {`${modalUser?.profile?.firstName || ""} ${
                    modalUser?.profile?.lastName || ""
                  }`.trim() ||
                    modalUser?.name ||
                    "-"}
                </Box>
                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  Email: {modalUser?.email || "-"}
                </Box>
                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  Role: {modalUser?.role?.name || "-"}
                </Box>
                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  Designation: {modalUser?.profile?.designation || "-"}
                </Box>
                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  Contact: {modalUser?.profile?.contactNumber || "-"}
                </Box>

                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  National ID: {modalUser?.profile?.nationalId || "-"}
                </Box>
                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  Employee ID: {modalUser?.profile?.employeeId || "-"}
                </Box>
                <Box component="li" sx={{ color: "#334155", mb: 1 }}>
                  Address: {modalUser?.profile?.address || "-"}
                </Box>
              </Box>
            ) : null}
          </DialogContent>
        </Dialog>
      </Box>
    </ResponsiveContainer>
  );
};

export default UserTable;
