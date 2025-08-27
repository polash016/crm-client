"use client";
import DSSelect from "@/components/Forms/DSSelect";
import { useGetAllDeliveryRatesQuery } from "@/redux/api/deliveryRateApi";

const DeliveryType = ({ defaultValues = {} }) => {
  const { data, isLoading, isError } = useGetAllDeliveryRatesQuery({});

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-[18px] text-slate-700 px-4 py-3 rounded-t-xl font-semibold">
          Delivery Type
        </div>

        <div className="flex items-center gap-40 px-3 ">
          <p className="text-sm px-3">
            Delivery Type <span className="text-red-600">*</span>{" "}
          </p>

          <DSSelect
            label={"Select Type"}
            isLoading={isLoading}
            isError={isError}
            placeholder={"Select Type"}
            options={
              data?.data?.map((data) => ({
                id: data.id,
                name: data.name,
              })) || []
            }
            name={"deliveryRateId"}
            fullWidth={true}
            // defaultValue={defaultValues?.deliveryRates?.map(
            //   (item) => item.deliveryRateId
            // )}
            defaultValue={defaultValues?.deliveryRateId}
          />
        </div>
      </div>
    </>
  );
};

export default DeliveryType;
