"use client";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Grid2,
  Checkbox,
  Typography,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { FiShield, FiCheck } from "react-icons/fi";

const groupPermissionsBySection = (options) => {
  // Define custom section names for better display
  const sectionNameMapping = {
    user: "User",
    users: "User", 
    tenant: "Tenant",
    tenants: "Tenant",
    brand: "Brand",
    brands: "Brand",
    category: "Category", 
    categories: "Category",
    sub_category: "SubCategory",
    sub_categories: "SubCategory",
    subcategory: "SubCategory",
    product: "Product",
    products: "Product",
    combo_pack: "Combo Pack",
    combo_packs: "Combo Pack",
    payment_method: "Payment Method",
    payment_methods: "Payment Method",
    delivery_rate: "Delivery Rate", 
    delivery_rates: "Delivery Rate",
    order: "Order",
    orders: "Order",
    role: "Role",
    roles: "Role",
    employee: "Employee",
    employees: "Employee",
    landing_page: "Landing Page",
    landing_pages: "Landing Page", 
    blog: "Blog",
    blogs: "Blog",
    blog_category: "Blog Category",
    blog_categories: "Blog Category",
    inventory: "Inventory", 
    inventories: "Inventory",
    history: "History",
    histories: "History",
    profile: "Profile",
    profiles: "Profile",
    lead: "Lead",
    leads: "Lead",
    customer: "Customer", 
    customers: "Customer"
  };

  const groups = {};

  // Group permissions dynamically based on their names
  options.forEach((option) => {
    const permissionName = option.name;
    
    // Extract the resource name from permission (everything after the first underscore)
    const parts = permissionName.split('_');
    let resourceName = '';
    
    // Handle different permission patterns
    if (parts.length >= 2) {
      if (parts[0] === 'manage') {
        resourceName = parts.slice(1).join('_');
      } else if (['view', 'create', 'edit', 'delete', 'update'].includes(parts[0])) {
        resourceName = parts.slice(1).join('_');
      } else {
        // If it doesn't start with a known action, use the whole thing
        resourceName = permissionName;
      }
    } else {
      resourceName = permissionName;
    }

    // Get the display name for the section
    const sectionName = sectionNameMapping[resourceName] || 
                       resourceName
                         .split('_')
                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                         .join(' ');

    // Initialize the group if it doesn't exist
    if (!groups[sectionName]) {
      groups[sectionName] = [];
    }

    // Add the permission to the appropriate group
    groups[sectionName].push(option);
  });

  // Sort permissions within each group by action priority
  const actionPriority = {
    'manage': 0,
    'view': 1, 
    'create': 2,
    'edit': 3,
    'update': 4,
    'delete': 5
  };

  Object.keys(groups).forEach(sectionName => {
    groups[sectionName].sort((a, b) => {
      const aAction = a.name.split('_')[0];
      const bAction = b.name.split('_')[0];
      const aPriority = actionPriority[aAction] !== undefined ? actionPriority[aAction] : 999;
      const bPriority = actionPriority[bAction] !== undefined ? actionPriority[bAction] : 999;
      return aPriority - bPriority;
    });
  });

  // Define section display order for better UX
  const sectionOrder = [
    'User', 'Role', 'Employee', 'Profile',
    'Lead', 'Customer',
    'Product', 'Combo Pack', 'Category', 'SubCategory', 'Brand', 'Inventory',
    'Order', 'Payment Method', 'Delivery Rate',
    'Blog', 'Blog Category', 'Landing Page',
    'Tenant', 'History'
  ];

  // Sort groups by the defined order, putting unknown sections at the end
  const sortedGroups = {};
  
  // First add sections in the defined order
  sectionOrder.forEach(sectionName => {
    if (groups[sectionName]) {
      sortedGroups[sectionName] = groups[sectionName];
    }
  });
  
  // Then add any remaining sections alphabetically
  Object.keys(groups)
    .filter(sectionName => !sectionOrder.includes(sectionName))
    .sort()
    .forEach(sectionName => {
      sortedGroups[sectionName] = groups[sectionName];
    });

  return sortedGroups;
};

const DSRadioInput = ({
  name,
  label,
  options = [],
  required = false,
  defaultValue = [],
  row = false,
  disabled = false,
  isLoading = false,
  isError = false,
}) => {
  const { control, formState } = useFormContext();
  const formError = formState.errors[name] !== undefined;
  const shouldDisable = disabled || isLoading || isError;
  const groupedOptions = groupPermissionsBySection(options);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const currentValue = Array.isArray(value) ? value : [];

        const handleCheck = (id) => {
          const isIdIncluded = currentValue.some((v) => v.id === id);

          if (isIdIncluded) {
            console.log(currentValue);
            onChange(currentValue.filter((v) => v.id !== id));
          } else {
            // Find the full object from your options that matches the id and add it
            const optionToAdd = options.find((option) => option.id === id);
            if (optionToAdd) {
              onChange([...currentValue, optionToAdd]);
            }
          }
        };

        return (
          <FormControl
            component="fieldset"
            // required={required}
            error={!!error?.message || isError}
            disabled={shouldDisable}
            fullWidth
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                p: 2,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <FiShield size={24} color="#8b5cf6" />
              <Typography
                variant="h6"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {label}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Object.entries(groupedOptions).map(([section, permissions]) => (
                <Paper
                  key={section}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    borderTop: '4px solid #10b981',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                      p: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <FiCheck size={20} color="#10b981" />
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#047857',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {section} Permissions
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(4, 120, 87, 0.7)',
                        fontSize: '0.8rem',
                        ml: 'auto',
                      }}
                    >
                      {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      {permissions.map((option) => (
                        <Grid item xs={12} sm={6} md={4} key={option.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={currentValue.some(
                                  (v) => v.id === option.id
                                )}
                                onChange={() => handleCheck(option.id)}
                                icon={
                                  <RadioButtonUncheckedIcon
                                    sx={{ 
                                      color: "#94a3b8",
                                      fontSize: '1.5rem',
                                    }}
                                  />
                                }
                                checkedIcon={
                                  <CheckBoxIcon 
                                    sx={{ 
                                      color: "#10b981",
                                      fontSize: '1.5rem',
                                    }}
                                  />
                                }
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontSize: '0.9rem',
                                  fontWeight: 500,
                                  color: currentValue.some((v) => v.id === option.id) 
                                    ? '#047857' 
                                    : '#475569',
                                  transition: 'color 0.2s ease',
                                }}
                              >
                                {option.name
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                  )
                                  .join(" ")}
                              </Typography>
                            }
                            sx={{
                              m: 0,
                              p: 1.5,
                              borderRadius: '12px',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              ))}
            </Box>
            {formError ? (
              <FormHelperText>{formState.errors[name]?.message}</FormHelperText>
            ) : isError ? (
              <FormHelperText>Error loading data</FormHelperText>
            ) : null}
          </FormControl>
        );
      }}
    />
  );
};

// const DSRadioInput = ({
//   name,
//   label,
//   options = [],
//   required = false,
//   defaultValue = "",
//   row = false,
//   disabled = false,
//   isLoading = false,
//   isError = false,
// }) => {
//   const { control, formState } = useFormContext();
//   const formError = formState.errors[name] !== undefined;
//   const shouldDisable = disabled || isLoading || isError;

//   const groupedOptions = groupPermissionsBySection(options);

//   console.log(defaultValue);
//   return (
//     <Controller
//       control={control}
//       name={name}
//       defaultValue={defaultValue || []}
//       render={({ field: { onChange, value }, fieldState: { error } }) => {
//         const currentValue = Array.isArray(value) ? value : [];
//         const handleCheck = (id) => {
//           if (currentValue.includes(id)) {
//             onChange(currentValue.filter((v) => v !== id));
//           } else {
//             onChange([...currentValue, id]);
//           }
//         };

//         return (
//           <FormControl
//             component="fieldset"
//             required={required}
//             error={!!error?.message || isError}
//             disabled={shouldDisable}
//             fullWidth
//           >
//             <FormLabel component="legend">{label}</FormLabel>
//             <div>
//               {Object.entries(groupedOptions).map(([section, permissions]) => (
//                 <div key={section} style={{ marginBottom: "16px" }}>
//                   <Typography
//                     variant="subtitle1"
//                     style={{
//                       marginBottom: "8px",
//                       fontWeight: "bold",
//                       fontSize: "1rem",
//                     }}
//                   >
//                     {section} Permissions
//                   </Typography>
//                   <Grid2 container spacing={2}>
//                     {permissions.map((option) => (
//                       <Grid2 item xs={12} sm={6} md={4} key={option.id}>
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               color="primary"
//                               checked={currentValue.includes(option.id)}
//                               onChange={() => handleCheck(option.id)}
//                               icon={
//                                 <RadioButtonUncheckedIcon
//                                   sx={{ color: "#64748b" }}
//                                 />
//                               }
//                               checkedIcon={<CheckBoxIcon />}
//                             />
//                           }
//                           label={option.name
//                             .split("_")
//                             .map(
//                               (word) =>
//                                 word.charAt(0).toUpperCase() + word.slice(1)
//                             )
//                             .join(" ")}
//                         />
//                       </Grid2>
//                     ))}
//                   </Grid2>
//                 </div>
//               ))}
//             </div>
//             {formError ? (
//               <FormHelperText>{formState.errors[name]?.message}</FormHelperText>
//             ) : isError ? (
//               <FormHelperText>Error loading data</FormHelperText>
//             ) : null}
//           </FormControl>
//         );
//       }}
//     />
//   );
// };

export default DSRadioInput;
