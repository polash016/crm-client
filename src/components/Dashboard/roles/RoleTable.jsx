"use client";
import React, { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useGetAllRolesQuery, useDeleteRoleMutation } from "@/redux/api/rolesApi";
import ModernTable from "@/components/Shared/ModernTable";
import ResponsiveContainer from "@/components/Shared/ResponsiveContainer";
import ActionButtons from "@/components/Shared/ActionButtons";
import RoleCreateModal from "./RoleCreateModal";
import RoleUpdateModal from "./RoleUpdateModal";
import { toast } from "sonner";


const RoleTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [modalPermissions, setModalPermissions] = useState([]);

  const { data: rolesData, isLoading: rolesLoading, refetch: refetchRoles } = useGetAllRolesQuery();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const handleCreateRole = () => setCreateModalOpen(true);
  const handleEditRole = (role) => { setSelectedRole(role); setUpdateModalOpen(true); };
  const handleViewPermissions = (role) => { setModalPermissions(role?.permissions || []); setPermissionsModalOpen(true); };

  const handleDeleteRole = async (role) => {
    try {
      await deleteRole(role.id).unwrap();
      toast.success("Role deleted successfully");
      refetchRoles();
    } catch (error) {
      toast.error("Failed to delete role");
      console.error("Delete role error:", error);
    }
  };

  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleCloseUpdateModal = () => { setUpdateModalOpen(false); setSelectedRole(null); };

  const rows = rolesData?.data || [];

  const columns = [
    { id: "name", label: "Name", render: (row) => row?.name || "-" },
    { id: "description", label: "Description", render: (row) => row?.description || "-" },
    {
      id: "permission",
      label: "Permission",
      render: (row) => (
        <button
          onClick={() => handleViewPermissions(row)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>View Permissions</span>
        </button>
      ),
    },
  ];

  return (
    <ResponsiveContainer>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>Roles</Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>Manage user roles and permissions</Typography>
          </Box>
          
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateRole} sx={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", "&:hover": { background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" }, px: 3, py: 1 }}>Add Role</Button>
        </Box>

        <ModernTable
          title="Roles"
          subtitle={`${rows.length} roles`}
          columns={columns}
          data={rows}
          loading={rolesLoading}
          customActions
          renderActions={(row) => (
            <ActionButtons resource="roles" onEdit={() => handleEditRole(row)} onDelete={() => handleDeleteRole(row)} size="sm" />
          )}
          emptyMessage="No roles found"
        />

        <RoleCreateModal open={createModalOpen} setOpen={setCreateModalOpen} onClose={handleCloseCreateModal} onSuccess={() => refetchRoles()} />
        <RoleUpdateModal open={updateModalOpen} setOpen={setUpdateModalOpen} role={selectedRole} onSuccess={() => refetchRoles()} />

        <Dialog open={permissionsModalOpen} onClose={() => setPermissionsModalOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0' }}>
            Permissions
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box component="ul" sx={{ p: 1, m: 0, listStyle: 'none' }}>
              {modalPermissions.length > 0 ? (
                modalPermissions.map((perm, idx) => (
                  <Box 
                    key={perm.id || idx}
                    component="li" 
                    sx={{
                      bgcolor: '#e3f2fd',
                      borderRadius: '12px',
                      px: 2,
                      py: 1,
                      mb: 1,
                      color: '#1565c0',
                      fontWeight: 500,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      border: '1px solid #bbdefb'
                    }}
                  >
                    {perm?.permission?.name?.split("_")?.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </Box>
                ))
              ) : (
                <Box component="li" sx={{ color: '#64748b', textAlign: 'center', py: 2 }}>No permissions</Box>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ResponsiveContainer>
  );
};

export default RoleTable;
