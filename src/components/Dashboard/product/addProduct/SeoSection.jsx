import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSKeywordsInput from "@/components/Forms/DSKeywordsInput";
import React from "react";

const SeoSection = ({ defaultValues = {} }) => {
  const handleSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-[18px] text-slate-700 px-4 py-3 rounded-t-xl font-semibold">
          Product (Search Engine Optimisation) SEO
        </div>

        {/* Product Meta Title */}

        <div className="space-y-3">
          <div className="flex items-center px-3 justify-between gap-20  ">
            <p className=" w-56 text-sm text-[#5e5873] px-3">
              Product Meta Title
            </p>

            <DSInput
              name={"seo.title"}
              fullWidth={true}
              defaultValue={defaultValues.seo?.title}
            />
          </div>
          {/* Product Meta Keywords*/}
          <div className="flex items-center px-3 justify-between gap-20 ">
            <p className=" w-56 text-sm text-[#5e5873] px-3">
              Product Meta Keywords
            </p>

            <div className="w-full">
              <DSKeywordsInput
                name="seo.keywords"
                fullWidth={true}
                defaultValue={defaultValues.seo?.keywords}
              />
            </div>
          </div>
          {/* Product Meta Descriptions */}
          <div className="flex items-center px-3 justify-between gap-20 ">
            <p className=" w-56 text-sm text-[#5e5873] px-3">
              Product Meta Descriptions
            </p>

            <DSInput
              name={"seo.description"}
              fullWidth={true}
              defaultValue={defaultValues.seo?.description}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SeoSection;
