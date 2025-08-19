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
  const canEdit = (resource) => {
    const editPermissions = {
      orders: ["manage_orders", "edit_order"],
      products: ["manage_products", "edit_product"],
      categories: ["manage_categories", "edit_category"],
      sub_categories: ["manage_sub_categories", "edit_sub_category"],
      brands: ["manage_brands", "edit_brand"],
      users: ["manage_users", "edit_user"],
      roles: ["manage_roles", "edit_role"],
      payment_methods: ["manage_payment_methods", "edit_payment_method"],
      delivery_rates: ["manage_delivery_rates", "edit_delivery_rate"],
      tenants: ["manage_tenants", "edit_tenant"],
      employees: ["manage_employees", "edit_employee"],
      landing_pages: ["manage_landing_pages", "edit_landing_page"],
    };
    const permissionsToCheck = editPermissions[resource] || [];
    const result = hasAnyPermission(permissionsToCheck);
    // console.log(`canEdit(${resource}):`, {
    //   permissionsToCheck,
    //   result,
    //   userPermissions: permissions,
    // });
    return result;
  };

  const canDelete = (resource) => {
    const deletePermissions = {
      orders: ["manage_orders", "delete_order"],
      products: ["manage_products", "delete_product"],
      categories: ["manage_categories", "delete_category"],
      sub_categories: ["manage_sub_categories", "delete_sub_category"],
      brands: ["manage_brands", "delete_brand"],
      users: ["manage_users", "delete_user"],
      roles: ["manage_roles", "delete_role"],
      payment_methods: ["manage_payment_methods", "delete_payment_method"],
      delivery_rates: ["manage_delivery_rates", "delete_delivery_rate"],
      tenants: ["manage_tenants", "delete_tenant"],
      employees: ["manage_employees", "delete_employee"],
      landing_pages: ["manage_landing_pages", "delete_landing_page"],
    };
    const permissionsToCheck = deletePermissions[resource] || [];
    const result = hasAnyPermission(permissionsToCheck);
    // console.log(`canDelete(${resource}):`, {
    //   permissionsToCheck,
    //   result,
    //   userPermissions: permissions,
    // });
    return result;
  };

  const canView = (resource) => {
    const viewPermissions = {
      orders: ["manage_orders", "view_order"],
      products: ["manage_products", "view_product"],
      categories: ["manage_categories", "view_category"],
      sub_categories: ["manage_sub_categories", "view_sub_category"],
      brands: ["manage_brands", "view_brand"],
      users: ["manage_users", "view_user"],
      roles: ["manage_roles", "view_role"],
      payment_methods: ["manage_payment_methods", "view_payment_method"],
      delivery_rates: ["manage_delivery_rates", "view_delivery_rate"],
      tenants: ["manage_tenants", "view_tenant"],
      employees: ["manage_employees", "view_employee"],
      landing_pages: ["manage_landing_pages", "view_landing_page"],
    };
    return hasAnyPermission(viewPermissions[resource] || []);
  };

  const canCreate = (resource) => {
    const createPermissions = {
      orders: ["manage_orders", "create_order"],
      products: ["manage_products", "create_product"],
      categories: ["manage_categories", "create_category"],
      sub_categories: ["manage_sub_categories", "create_sub_category"],
      brands: ["manage_brands", "create_brand"],
      users: ["manage_users", "create_user"],
      roles: ["manage_roles", "create_role"],
      payment_methods: ["manage_payment_methods", "create_payment_method"],
      delivery_rates: ["manage_delivery_rates", "create_delivery_rate"],
      tenants: ["manage_tenants", "create_tenant"],
      employees: ["manage_employees", "create_employee"],
      landing_pages: ["manage_landing_pages", "create_landing_page"],
    };
    return hasAnyPermission(createPermissions[resource] || []);
  };

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
    // Update user data
    updateUser: (userData) => dispatch(setUser(userData)),
    updatePermissions: (perms) => dispatch(setPermissions(perms)),
  };
};
