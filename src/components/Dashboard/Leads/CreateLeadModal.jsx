"use client";
import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { toast } from "sonner";
import DSModal from "@/components/Shared/DSModal/DSModal";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import { useCreateLeadMutation } from "@/redux/api/leadsApi";
import DSKeywordsInput from "@/components/Forms/DSKeywordsInput";

const CreateLeadModal = ({ open, setOpen }) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();

  const handleSubmit = async (data) => {
    try {
      // Split the name into firstName and lastName
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create the lead data object
      const leadData = {
        firstName,
        lastName,
        phone: data.phone,
        description: data.address, // Using description for address
        notes: `Items: ${data.items}\nPrice: ${data.price}`, // Combining items and price in notes
      };

      // If there's a follow-up date, we could handle it here
      // For now, we'll just log it or store it in notes
      if (data.followUpDate) {
        leadData.notes += `\nFollow-up Date: ${data.followUpDate}`;
      }

      //   const result = await createLead(leadData).unwrap();

      //   toast.success("Lead created successfully!");
      //   setOpen(false);

      // Optional: Reset form or perform additional actions
      //   console.log("Created lead:", result);
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error?.data?.message || "Failed to create lead");
    }
  };

  const defaultValues = {
    name: "",
    address: "",
    phone: "",
    items: "",
    price: "",
    followUpDate: "",
  };

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title="Create New Lead"
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        <DSForm onSubmit={handleSubmit} defaultValues={defaultValues}>
          <Grid container spacing={3}>
            {/* Name Field */}
            <Grid item xs={12} md={6}>
              <DSInput
                name="name"
                // label="Full Name"
                placeholder="Enter full name"
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Phone Number Field */}
            <Grid item xs={12} md={6}>
              <DSInput
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Address Field */}
            <Grid item xs={12}>
              <DSInput
                name="address"
                // label="Address"
                placeholder="Enter address"
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Items Field */}
            <Grid item xs={12} md={6}>
              <DSKeywordsInput
                name="items"
                // label="Items"
                placeholder="Enter items"
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Price Field */}
            <Grid item xs={12} md={6}>
              <DSInput
                name="price"
                // label="Price"
                placeholder="Enter price"
                type="number"
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Follow-up Date Field */}
            <Grid item xs={12} md={6}>
              <DSInput
                name="followUpDate"
                // label="Follow-up Date"
                type="date"
                fullWidth
                sx={{ mt: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
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
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              sx={{
                minWidth: 100,
                borderColor: "text.secondary",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "text.primary",
                  color: "text.primary",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                minWidth: 120,
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "&:disabled": {
                  backgroundColor: "action.disabledBackground",
                },
              }}
            >
              {isLoading ? "Creating..." : "Create Lead"}
            </Button>
          </Box>
        </DSForm>
      </Box>
    </DSModal>
  );
};

export default CreateLeadModal;
