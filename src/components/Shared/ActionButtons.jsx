import React from "react";
import {
  FiEdit,
  FiTrash2,
  FiDownload,
  FiEye,
  FiTrash,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

const ActionButtons = ({
  resource,
  onEdit,
  onDelete,
  onDownload,
  onView,
  onDetails,
  showEdit = true,
  showDelete = true,
  showDownload = false,
  showView = false,
  showDetails = true,
  editTooltip = "Edit",
  deleteTooltip = "Delete",
  downloadTooltip = "Download",
  viewTooltip = "View",
  detailsTooltip = "Details",
  className = "",
  size = "sm",
}) => {
  const { canEdit, canDelete, canView } = useAuth();

  const buttonClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-2.5 text-lg",
  };

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Details Button */}
      {showDetails && onDetails && (
        <button
          onClick={onDetails}
          title={detailsTooltip}
          className={`${buttonClasses[size]} text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors duration-200`}
        >
          <FiEye className={iconClasses[size]} />
        </button>
      )}

      {/* View Button */}
      {showView && canView(resource) && onView && (
        <button
          onClick={onView}
          title={viewTooltip}
          className={`${buttonClasses[size]} text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-200`}
        >
          <FiExternalLink className={iconClasses[size]} />
        </button>
      )}

      {/* Edit Button */}
      {showEdit && canEdit(resource) && onEdit && (
        <button
          onClick={onEdit}
          title={editTooltip}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 12px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginRight: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          <FiEdit className={iconClasses[size]} />
        </button>
      )}

      {/* Download Button */}
      {showDownload && onDownload && (
        <button
          onClick={onDownload}
          title={downloadTooltip}
          className={`${buttonClasses[size]} text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200`}
        >
          <FiDownload className={iconClasses[size]} />
        </button>
      )}

      {/* Delete Button */}
      {showDelete && canDelete(resource) && onDelete && (
        <button
          onClick={onDelete}
          title={deleteTooltip}
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #ef4444 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 12px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(244, 63, 94, 0.3)';
          }}
        >
          <FiTrash2 className={iconClasses[size]} />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
