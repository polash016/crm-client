import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

export const drawerItems = (permissions) => {
  // Validate permissions input
  if (!permissions || !Array.isArray(permissions)) {
    console.warn('drawerItems: permissions must be an array, received:', permissions);
    permissions = [];
  }

  const permissionMap = {
    manage_tenants: "Tenant",
    view_tenant: "Tenant",

    manage_users: "Users",
    view_user: "Users",

    manage_leads: "Leads",
    view_lead: "Leads",

    manage_brands: "Brand",
    view_brand: "Brand",

    manage_products: "Manage Product",
    view_product: "Manage Product",

    manage_payment_methods: "Cour. & Delivery",
    view_payment_method: "Cour. & Delivery",

    manage_delivery_rates: "Cour. & Delivery",
    view_delivery_rate: "Cour. & Delivery",

    manage_sub_categories: "Category",
    view_sub_category: "Category",

    manage_orders: "Order Management",
    view_order: "Order Management",

    // manage_roles: "Users",
    // view_roles: "Users",
    // update_roles: "Users",
    // delete_roles: "Users",

    manage_employees: "Employees",
    view_employee: "Employees",

    manage_landing_pages: "Page Builder",
    view_landing_page: "Page Builder",

    manage_blogs: "Blogs",
    view_blog: "Blogs",

    // manage_blog_categories: "Blog Categories",
    // view_blog_category: "Blog Categories",

    // manage_inventories: "Inventory",
    // view_inventory: "Inventory",
  };

  const roleMenues = [];
  
  // Safely extract permission names
  const permissionSet = new Set();
  try {
    permissions.forEach((permission) => {
      if (permission && typeof permission === 'object' && permission.name) {
        permissionSet.add(permission.name);
      }
    });
  } catch (error) {
    console.error('Error processing permissions:', error);
  }

  roleMenues.push({
    title: "Dashboard",
    path: "dashboard",
    icon: DashboardIcon,
  });

  const menuTitles = new Set(Object.values(permissionMap));
  menuTitles.forEach((menuTitle) => {
    const menuPermissions = Object.keys(permissionMap).filter(
      (permission) => permissionMap[permission] === menuTitle
    );

    if (menuPermissions.some((permission) => permissionSet.has(permission))) {
      const childItems = getChildItems(menuTitle, permissionSet);
      // Only add menu if it has valid child items
      if (childItems && childItems.length > 0) {
        roleMenues.push({
          title: menuTitle,
          icon: getIcon(menuTitle),
          child: childItems,
        });
      }
    }
  });

  return roleMenues;
};

const getIcon = (title) => {
  switch (title) {
    case "Dashboard":
      return DashboardIcon;
    case "Order Management":
    case "Cour. & Delivery":
    case "Category":
    case "Brand":
    case "Manage Product":
      return Inventory2Icon;
    case "Users":
    case "Employees":
      return PeopleIcon;
    case "Tenant":
    case "Page Builder":
    case "Blogs":
    case "Blog Categories":
    case "Inventory":
      return ProductionQuantityLimitsIcon;
    default:
      return null;
  }
};

const getChildItems = (title, permissionSet) => {
  const childItems = {
    "Order Management": [
      { title: "Order List", path: "manageOrder" },
      // permissionSet.has("manage_orders") || permissionSet.has("update_order")
      //   ? { title: "Edit Orders", path: "editOrder" }
      //   : null,
      // permissionSet.has("manage_orders") || permissionSet.has("delete_order")
      //   ? { title: "Delete Orders", path: "deleteOrder" }
      //   : null,
      { title: "Incomplete Orders", path: "incompleteOrder" },
    ],
    "Cour. & Delivery": [
      permissionSet.has("manage_delivery_rates") ||
      permissionSet.has("view_delivery_rate")
        ? { title: "Delivery Rates", path: "delivery-rates" }
        : null,
      permissionSet.has("manage_payment_methods") ||
      permissionSet.has("view_payment_method")
        ? { title: "Payment Methods", path: "payment-methods" }
        : null,
    ],
    Leads: [
      permissionSet.has("manage_leads") ||
      permissionSet.has("view_lead")
        ? { title: "Leads", path: "leads" }
        : null,
    
    ],
    Brand: [{ title: "Brands", path: "brands" }],
    "Manage Product": [
      permissionSet.has("manage_products") || permissionSet.has("view_product")
        ? { title: "All Product", path: "allProduct" }
        : null,
      permissionSet.has("manage_combo_packs") ||
      permissionSet.has("view_combo_pack")
        ? { title: "Combo Product", path: "combo-products" }
        : null,
    ],
    Users: [
      permissionSet.has("manage_roles") || permissionSet.has("view_role")
        ? { title: "Roles", path: "users/roles" }
        : null,
      permissionSet.has("manage_users") || permissionSet.has("view_user")
        ? { title: "Users", path: "users" }
        : null,
    ],
    Tenant: [{ title: "Tenants", path: "tenant" }],
    Employees: [{ title: "Employees", path: "employees" }],
    "Page Builder": [
      { title: "Landing Pages", path: "pages/landings" },
      // { title: "Create Page", path: "pages/landings/add" },
      // { title: "Page List", path: "pages/landings/view" },
      // { title: "Landing Page", path: "pages/landings/edit" },
      // { title: "Landing Pages", path: "pages/landing" },
      // { title: "Templates Demo", path: "pages/landing/demo" },
    ],
    "Blogs": [
      { title: "All Blogs", path: "blogs" },
      { title: "Add Blog", path: "blogs/add" },
    ],
    "Blog Categories": [
      { title: "All Categories", path: "blog-categories" },
      { title: "Add Category", path: "blog-categories/add" },
    ],
    "Inventory": [
      { title: "All Inventory", path: "inventory" },
      { title: "Add Inventory", path: "inventory/add" },
    ],
  };

  // Get the items for this title and filter out null values
  const items = childItems[title] || [];
  return items.filter(item => item !== null && typeof item === 'object' && item.title && item.path);
};
