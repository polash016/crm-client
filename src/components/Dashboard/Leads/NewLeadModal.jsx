"use client";
import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import DSModal from "@/components/Shared/DSModal/DSModal";
import DSForm from "@/components/Forms/DSForm";
import DSFileInput from "@/components/Shared/DSFileInput";
import DSUserSelect from "@/components/Shared/DSUserSelect";
import DSSelect from "@/components/Forms/DSSelect";
import { useCreateLeadsMutation } from "@/redux/api/leadsApi";
import { toast } from "sonner";

const NewLeadModal = ({ open, setOpen }) => {
  const [createLeads] = useCreateLeadsMutation();

  // Source options
  const sourceOptions = [
    {
      id: "Website",
      name: "Website",
    },
    {
      id: "Phone Call",
      name: "Phone Call",
    },

    {
      id: "Referral",
      name: "Referral",
    },

    {
      id: "Social Media",
      name: "Social Media",
    },

    {
      id: "Other",
      name: "Other",
    },
  ];

  // Handle sample CSV download
  const handleDownloadSampleCSV = () => {
    // Create empty CSV with just headers
    const headers = [
      "name",
      "phone",
      "address",
      "source",
      "items",
      "price",
      "date",
      "orderDate",
    ];
    const csvContent = headers.join(",") + "\n";

    // Create and download file
    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      // Set download attributes
      a.href = url;
      a.download = "sample_leads_template.csv";
      a.style.display = "none";

      // Append to body, click, and cleanup
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Fallback for older browsers
      const dataUri =
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
      const link = document.createElement("a");
      link.href = dataUri;
      link.download = "sample_leads_template.csv";
      link.click();
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      const { csvFile, ...rest } = data;
      const formData = new FormData();

      // If CSV file is selected, handle CSV upload
      if (data.csvFile) {
        formData.append("csvFile", data.csvFile);
      }

      formData.append("data", JSON.stringify({ rest }));

      const res = createLeads(formData).unwrap();

      toast.promise(res, {
        loading: "Creating...",
        success: (res) => {
          if (res?.data?.length > 0) {
            setOpen(false);
            return res?.message || "Lead created successfully";
          }
          return res?.message || "Lead created";
        },
        error: (error) => error?.message || "Something went wrong",
      });
      // Close modal
      // setOpen(false);

      // TODO: Show success toast and refresh leads list
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      // TODO: Show error toast
    }
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title="Create New Lead"
      maxWidth="md"
      fullWidth
    >
      <DSForm
        onSubmit={handleFormSubmit}
        defaultValues={{
          csvFile: null,
          assignedToId: "",
          source: "",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* CSV File Upload */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <UploadIcon />
                Upload CSV File
              </Typography>

              <DSFileInput
                label="CSV File"
                description="Upload a CSV file to create multiple leads at once"
                accept=".csv"
                name="csvFile"
                helperText="Supported format: CSV files only"
                buttonText="Choose CSV file or drag and drop"
              />

              {/* Sample CSV Download */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "info.50",
                  border: "1px solid",
                  borderColor: "info.200",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="info.main"
                    fontWeight={500}
                    sx={{ mb: 0.5 }}
                  >
                    📋 Need a template?
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Download our sample CSV template to see the expected format
                    and required fields
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadSampleCSV}
                  sx={{
                    borderColor: "info.main",
                    color: "info.main",
                    "&:hover": {
                      borderColor: "info.dark",
                      backgroundColor: "info.50",
                    },
                    minWidth: "auto",
                    px: 2,
                  }}
                >
                  Download Template
                </Button>
              </Box>
            </Grid>

            {/* User Assignment */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <AssignmentIcon />
                Assign to User
              </Typography>

              <DSUserSelect
                // label="User Assignment"
                // description="Search and select a user to assign the leads to"
                name="assignedToId"
                placeholder="Search users to assign..."
                showAllUsersOnFocus={true}
                maxUsersToShow={10}
              />
            </Grid>

            {/* Source */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <BusinessIcon />
                Lead Source
              </Typography>

              <DSSelect
                name="source"
                // label="Source"
                fullWidth={true}
                size="medium"
                sx={{
                  "& .MuiSelect-select": {
                    padding: "10px 16px",
                  },
                  width: "150%",
                }}
                options={sourceOptions}
                onChange={(value) => console.log("Source selected:", value)}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: "success.main",
                "&:hover": {
                  backgroundColor: "success.dark",
                },
              }}
            >
              Upload & Create Leads
            </Button>
          </Box>
        </Box>
      </DSForm>
    </DSModal>
  );
};

export default NewLeadModal;
