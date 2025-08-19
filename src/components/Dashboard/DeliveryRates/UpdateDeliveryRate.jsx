import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSModal from "@/components/Shared/DSModal/DSModal";
import { useUpdateDeliveryRateMutation } from "@/redux/api/deliveryRateApi";
import { Button } from "@mui/material";
import React from "react";
import { toast } from "sonner";

const UpdateDeliveryRate = ({ open, setOpen, deliveryRate }) => {
  const [updateDeliveryRate] = useUpdateDeliveryRateMutation();

  const handleSubmit = async (data) => {
    const finalObj = {
      name: data?.name,
      price: Number(data?.price),
    };
    const res = updateDeliveryRate({
      data: finalObj,
      id: deliveryRate.id,
    }).unwrap();

    toast.promise(res, {
      loading: "Updating...",
      success: (res) => {
        if (res?.data?.id) {
          setOpen(false);
          return res?.message || "Delivery Rate updated successfully";
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
      title="Update Delivery Rate"
      fullWidth={true}
      width="90vw"
      sx={{ height: "full", mx: "auto" }}
    >
      <DSForm onSubmit={handleSubmit} className="space-y-8">
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
                  required
                  defaultValue={deliveryRate.name}
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
                  required
                  defaultValue={deliveryRate.price}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              type="submit"
              className="rounded-2xl shadow-lg px-6 py-3 font-semibold"
            >
              Publish
            </Button>
          </div>
        </div>
      </DSForm>
    </DSModal>
  );
};

export default UpdateDeliveryRate;
