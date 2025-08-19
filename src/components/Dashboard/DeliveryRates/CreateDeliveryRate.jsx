import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { useCreateDeliveryRateMutation } from "@/redux/api/deliveryRateApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React from "react";
import { toast } from "sonner";
import z from "zod";

const deliveryRateSchema = z.object({
  name: z
    .string({ required_error: "Delivery rate name is required" })
    .min(2, "Delivery rate name must be at least 2 characters")
    .max(100, "Delivery rate name must not exceed 100 characters"),
  price: z
    .string({ required_error: "Delivery rate is required" })
    .min(1, "Delivery rate is required"),
});

const CreateDeliveryRate = ({ open, setOpen }) => {
  const [createDeliveryRate] = useCreateDeliveryRateMutation();

  const handleSubmit = async (data) => {
    const finalObj = {
      name: data.name,
      price: Number(data.price),
    };
    const res = createDeliveryRate(finalObj).unwrap();

    toast.promise(res, {
      loading: "Creating...",
      success: (res) => {
        if (res?.data?.id) {
          setOpen(false);
          return res?.message || "Delivery Rate created successfully";
        } else {
          return res?.message;
        }
      },
      error: (error) => {
        return error?.message || "Something went wrong";
      },
    });
  };

  return (
    <DSModal
      open={open}
      setOpen={setOpen}
      title="Create Delivery Rate"
      sx={{ height: "full", mx: "auto" }}>
      <DSForm
        onSubmit={handleSubmit}
        resolver={zodResolver(deliveryRateSchema)}
        defaultValues={{ name: "", price: 0 }}
        className="space-y-8">
        <div className="space-y-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Basic Information
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Delivery Rate Name *
                </label>
                <DSInput
                  fullWidth={true}
                  label={"Enter Delivery Rate Name"}
                  name={"name"}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Delivery Rate *
                </label>
                <DSInput
                  fullWidth={true}
                  type="number"
                  label={"Enter Delivery Rate"}
                  name={"price"}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center cursor-pointer gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0">
              Submit
            </button>
          </div>
        </div>
      </DSForm>
    </DSModal>
  );
};

export default CreateDeliveryRate;
