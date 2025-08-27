import { useSelector, useDispatch } from "react-redux";
import { setPermissions, setUser } from "@/redux/slices/authSlice";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, permissions, isLoading, error } = useSelector(
    (state) => state.auth
  );

  // Fetch user permissions if user exists but permissions are empty
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(
    { id: user?.id },
    {
      skip: !user?.id || permissions.length > 0,
      refetchOnMountOrArgChange: true,
    }
  );

  // Update permissions when user data is fetched
  useEffect(() => {
    if (userData?.data?.permissions && permissions.length === 0) {
      const userPermissions = userData.data.permissions.map((p) => p.name);
      dispatch(setPermissions(userPermissions));
    }
  }, [userData, permissions.length, dispatch]);

  // Permission checking functions
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  };

  // Common permission groups for easy access
  const resourceMap = {
    lead: { singular: "lead", plural: "leads" },
    leads: { singular: "lead", plural: "leads" },
    product: { singular: "product", plural: "products" },
    products: { singular: "product", plural: "products" },
    category: { singular: "category", plural: "categories" },
    categories: { singular: "category", plural: "categories" },
    sub_category: { singular: "sub_category", plural: "sub_categories" },
    sub_categories: { singular: "sub_category", plural: "sub_categories" },
    brand: { singular: "brand", plural: "brands" },
    brands: { singular: "brand", plural: "brands" },
    user: { singular: "user", plural: "users" },
    users: { singular: "user", plural: "users" },
    role: { singular: "role", plural: "roles" },
    roles: { singular: "role", plural: "roles" },
    payment_method: { singular: "payment_method", plural: "payment_methods" },
    payment_methods: { singular: "payment_method", plural: "payment_methods" },
    delivery_rate: { singular: "delivery_rate", plural: "delivery_rates" },
    delivery_rates: { singular: "delivery_rate", plural: "delivery_rates" },
    tenant: { singular: "tenant", plural: "tenants" },
    tenants: { singular: "tenant", plural: "tenants" },
    employee: { singular: "employee", plural: "employees" },
    employees: { singular: "employee", plural: "employees" },
    landing_page: { singular: "landing_page", plural: "landing_pages" },
    landing_pages: { singular: "landing_page", plural: "landing_pages" },
  };

  const resolveResource = (resource) => {
    const key = (resource || "").toString().toLowerCase();
    if (resourceMap[key]) return resourceMap[key];
    if (key.endsWith("ies"))
      return { singular: key.slice(0, -3) + "y", plural: key };
    if (key.endsWith("s")) return { singular: key.slice(0, -1), plural: key };
    return { singular: key, plural: key + "s" };
  };
  const canEdit = (resource) => {
    const { singular, plural } = resolveResource(resource);
    return hasAnyPermission([`manage_${plural}`, `edit_${singular}`]);
  };

  const canDelete = (resource) => {
    const { singular, plural } = resolveResource(resource);
    return hasAnyPermission([`manage_${plural}`, `delete_${singular}`]);
  };

  const canView = (resource) => {
    const { singular, plural } = resolveResource(resource);
    return hasAnyPermission([`manage_${plural}`, `view_${singular}`]);
  };

  const canCreate = (resource) => {
    const { singular, plural } = resolveResource(resource);
    return hasAnyPermission([`manage_${plural}`, `create_${singular}`]);
  };

  // const canUpload = (resource) => {
  //   const { singular, plural } = resolveResource(resource);
  //   return hasAnyPermission([`manage_${plural}`, `create_${singular}`]);
  // };

  return {
    user,
    permissions,
    isLoading: isLoading || userLoading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canEdit,
    canDelete,
    canView,
    canCreate,
    // canUpload,
    // Update user data
    updateUser: (userData) => dispatch(setUser(userData)),
    updatePermissions: (perms) => dispatch(setPermissions(perms)),
  };
};
