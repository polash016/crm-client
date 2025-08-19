"use client";
import { Button, CircularProgress } from "@mui/material";
import { FiCheck, FiPlus, FiEdit, FiSave } from "react-icons/fi";

const DSSubmitButton = ({
  type = "submit",
  isLoading = false,
  disabled = false,
  variant = "primary", // primary, secondary, success, warning, danger
  size = "large", // small, medium, large
  children,
  onClick,
  startIcon,
  endIcon,
  fullWidth = false,
  loadingText = "Processing...",
  sx = {},
  ...props
}) => {
  // Define color schemes for different variants
  const getVariantStyles = (variant) => {
    switch (variant) {
      case "primary":
        return {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          hover: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #9333ea 100%)',
          shadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
          hoverShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
        };
      case "secondary":
        return {
          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
          hover: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
          shadow: '0 4px 20px rgba(100, 116, 139, 0.3)',
          hoverShadow: '0 8px 32px rgba(100, 116, 139, 0.4)',
        };
      case "success":
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          hover: 'linear-gradient(135deg, #047857 0%, #065f46 50%, #064e3b 100%)',
          shadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          hoverShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
        };
      case "warning":
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
          hover: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)',
          shadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
          hoverShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
        };
      case "danger":
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
          hover: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
          shadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
          hoverShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
        };
      case "cancel":
        return {
          background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
          hover: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
          shadow: '0 4px 20px rgba(20, 184, 166, 0.3)',
          hoverShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
        };
        case "modern":
          return {
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
hover: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
shadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
hoverShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
          }
      default:
        return getVariantStyles("primary");
    }
  };

  // Define size configurations
  const getSizeStyles = (size) => {
    switch (size) {
      case "small":
        return {
          px: 3,
          py: 1,
          fontSize: '0.85rem',
          borderRadius: '12px',
          minHeight: '36px',
        };
      case "medium":
        return {
          px: 4,
          py: 1.5,
          fontSize: '0.9rem',
          borderRadius: '14px',
          minHeight: '42px',
        };
      case "large":
        return {
          px: 5,
          py: 2,
          fontSize: '1rem',
          borderRadius: '16px',
          minHeight: '48px',
        };
      default:
        return getSizeStyles("medium");
    }
  };

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  // Default icons based on loading state and variant
  const getDefaultIcon = () => {
    if (isLoading) return null;
    if (startIcon) return startIcon;
    
    // Auto-select icon based on button text or variant
    const text = children?.toString().toLowerCase() || '';
    if (text.includes('create') || text.includes('add')) return <FiPlus size={18} />;
    if (text.includes('update') || text.includes('edit')) return <FiEdit size={18} />;
    if (text.includes('save')) return <FiSave size={18} />;
    return <FiCheck size={18} />;
  };

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={
        isLoading ? (
          <CircularProgress 
            size={18} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
        ) : (
          getDefaultIcon()
        )
      }
      endIcon={!isLoading && endIcon}
      sx={{
        ...sizeStyles,
        background: variantStyles.background,
        color: 'white',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: variantStyles.shadow,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transition: 'left 0.6s ease',
        },
        '&:hover': {
          background: variantStyles.hover,
          boxShadow: variantStyles.hoverShadow,
          transform: 'translateY(-2px) scale(1.02)',
          '&::before': {
            left: '100%',
          },
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
        },
        '&:disabled': {
          background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
          color: 'rgba(255, 255, 255, 0.7)',
          boxShadow: 'none',
          transform: 'none',
          cursor: 'not-allowed',
          '&::before': {
            display: 'none',
          },
        },
        // Custom styles override
        ...sx,
      }}
      {...props}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default DSSubmitButton;
