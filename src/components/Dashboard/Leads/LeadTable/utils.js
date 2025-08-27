// Small shared helpers for Leads table

export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const getOutcomeColor = (outcome) => {
  switch (outcome) {
    case "COMPLETED":
      return "success";
    case "NO_ANSWER":
    case "BUSY":
      return "warning";
    case "WRONG_NUMBER":
      return "error";
    case "REVIEW_CAPTURED":
    case "HEALTH_UPDATE_ONLY":
      return "info";
    default:
      return "default";
  }
};

export const getRowStyling = (row) => {
  if (!row?.nextFollowUpAt) return {};

  const followUpDate = new Date(row.nextFollowUpAt);
  const now = new Date();
  const timeDiff = followUpDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < 0) {
    return {
      backgroundColor: "rgba(239, 68, 68, 0.05)",
      borderLeft: "4px solid #dc2626",
      "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
    };
  } else if (daysDiff === 0) {
    return {
      backgroundColor: "rgba(251, 146, 60, 0.05)",
      borderLeft: "4px solid #ea580c",
      "&:hover": { backgroundColor: "rgba(251, 146, 60, 0.1)" },
    };
  } else if (daysDiff <= 2) {
    return {
      backgroundColor: "rgba(251, 191, 36, 0.05)",
      borderLeft: "4px solid #ca8a04",
      "&:hover": { backgroundColor: "rgba(251, 191, 36, 0.1)" },
    };
  }

  return {};
};

// Summary helpers
export const countUrgent = (rows) =>
  rows.filter((lead) => {
    if (!lead.nextFollowUpAt) return false;
    const d = new Date(lead.nextFollowUpAt);
    const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 3600 * 24));
    return days < 0;
  }).length;

export const countDueToday = (rows) =>
  rows.filter((lead) => {
    if (!lead.nextFollowUpAt) return false;
    const d = new Date(lead.nextFollowUpAt);
    const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 3600 * 24));
    return days === 0;
  }).length;

export const countNoFollowUp = (rows) =>
  rows.filter((lead) => !lead.nextFollowUpAt).length;

export const countRecentActivity = (rows) =>
  rows.filter((lead) => {
    if (!lead.leadFollowUp || lead.leadFollowUp.length === 0) return false;
    const last = lead.leadFollowUp[lead.leadFollowUp.length - 1];
    const lastDate = new Date(last.attemptedAt);
    const days = Math.ceil(
      (Date.now() - lastDate.getTime()) / (1000 * 3600 * 24)
    );
    return days <= 1;
  }).length;
