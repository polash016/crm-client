"use client";
import React from "react";
import { Box, Button, Grid, Typography, FormHelperText } from "@mui/material";
import { toast } from "sonner";
import DSModal from "@/components/Shared/DSModal/DSModal";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import { useCreateLeadMutation } from "@/redux/api/leadsApi";
import DSKeywordsInput from "@/components/Forms/DSKeywordsInput";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  items: z.array(z.string()).min(1, "Items are required"),
  price: z.string().min(1, "Price is required"),
  followUpDate: z.string().optional(),
  source: z.string().optional(),
});

const CreateLeadModal = ({ open, setOpen }) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();

  const handleSubmit = async (data) => {
    try {
      // Create the lead data object
      const leadData = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        items: data.items,
        price: Number(data.price),
        nextFollowUpAt: data.followUpDate,
        source: data.source,
      };

      console.log("Lead data:", leadData);

      const res = createLead(leadData).unwrap();

      toast.promise(res, {
        loading: "Creating...",
        success: (res) => {
          if (res?.data?.id) {
            setOpen(false);
            return res?.message || "Lead created successfully";
          }
          return res?.message || "Lead created";
        },
        error: (error) => error?.message || "Something went wrong",
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error?.data?.message || "Failed to create lead");
    }
  };

  const defaultValues = {
    name: "",
    address: "",
    phone: "",
    items: [],
    price: "",
    followUpDate: "",
    source: "",
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
        <DSForm
          onSubmit={handleSubmit}
          resolver={zodResolver(createLeadSchema)}
          defaultValues={defaultValues}
        >
          <Grid container spacing={3}>
            {/* Name Field */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Full Name *
              </Typography>
              <DSInput name="name" placeholder="Enter full name" fullWidth />
            </Grid>

            {/* Phone Number Field */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Phone Number
              </Typography>
              <DSInput
                name="phone"
                placeholder="Enter phone number"
                fullWidth
              />
            </Grid>

            {/* Address Field */}
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Address
              </Typography>
              <DSInput
                name="address"
                placeholder="Enter complete address"
                fullWidth
                // multiline
                rows={3}
              />
            </Grid>

            {/* Items Field */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Items/Services
              </Typography>
              <DSKeywordsInput
                name="items"
                placeholder="Enter items or services (press Enter to add)"
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            {/* Price Field */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Price (₹)
              </Typography>
              <DSInput
                name="price"
                placeholder="Enter total price"
                type="number"
                fullWidth
              />
            </Grid>

            {/* Follow-up Date Field */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Follow-up Date
              </Typography>
              <DSInput
                name="followUpDate"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Source
              </Typography>
              <DSInput
                name="source"
                type="text"
                fullWidth
                // InputLabelProps={{
                //   shrink: true,
                // }}
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
