import DSFile from "@/components/Forms/DSFile";
import DSFileWithPreview from "@/components/Forms/DSFilePreview";
import DSFiles from "@/components/Forms/DSFiles";
import DSFilesWithPreview from "@/components/Forms/DSFilesPreview";
import DSForm from "@/components/Forms/DSForm";
import DSInput from "@/components/Forms/DSInput";
import DSSelect from "@/components/Forms/DSSelect";
import React from "react";

const MediaSection = ({
  defaultValues = {},
  mediaHeight = 180,
  multiImageHeight = 140,
  multiImageWidth = 140,
}) => {
  return (
    <div>
      <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-slate-700 px-4 py-3.5 rounded-t-md font-semibold">
          Media
        </div>

        {/* Product Image */}
        <div className="px-4 py-2 flex justify-between">
          <label className="flex flex-1/4 text-sm font-medium mb-4  items-center">
            Product Image <span className="text-red-500">*</span>
          </label>

          {/* Grid Layout - 7 columns with consistent sizing */}
          <div className="grid grid-cols-7 gap-4">
            {/* Cover Image (spans 2 columns and 2 rows) */}
            <div
              className="col-span-2 row-span-2 border-[#cbd5e1] w-full border border-dashed rounded-xl bg-[#F8F9FA] flex flex-col items-center justify-center text-gray-500 relative"
              style={{ height: mediaHeight }}
            >
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                1
              </div>
              <DSFileWithPreview
                name="coverImg"
                label="Cover Image (800x800)"
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "12px", // Tailwind's `rounded-xl`
                  backgroundColor: "#f8f9fa",
                  aspectRatio: "1 / 1",
                  cursor: "pointer",
                }}
                required={true}
                defaultValue={defaultValues?.coverImg}
              />
              {/* <div className="text-lg font-medium mb-1">Cover Image</div>
              <div className="text-center">
                Size
                <br />
                (800 x 800)
              </div> */}
            </div>

            <div
              className="border border-dashed border-[#cbd5e1] rounded-xl bg-[#f8f9fa] aspect-square w-full flex flex-col items-center justify-center text-gray-500 relative overflow-x-auto"
              style={{
                height: multiImageHeight,
                minHeight: multiImageHeight,
                maxHeight: multiImageHeight,
              }}
            >
              <DSFilesWithPreview
                name={`files`}
                label={`Other Images`}
                sx={{
                  cursor: "pointer",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "12px", // Tailwind's `rounded-xl`
                  backgroundColor: "#f8f9fa",
                  aspectRatio: "1 / 1", // Tailwind's `aspect-square`
                  width: multiImageWidth,
                  height: multiImageHeight,
                  minHeight: multiImageHeight,
                  maxHeight: multiImageHeight,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280", // Tailwind's `text-gray-500`
                  position: "relative",
                  overflowX: "auto",
                }}
                required={true}
                defaultValue={defaultValues?.images}
              />
              {/* <div className="text-center">
                <div>Size</div>
                <div>(800 x 800)</div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Insert Video Embed (Youtube/Facebook/Vimeo) */}
        <div className="flex items-center px-3 justify-between gap-20 pb-2">
          <p className=" w-56 text-sm text-[#5e5873] px-3">
            Insert Video Embed (Youtube/Facebook/Vimeo)
          </p>
          <DSInput
            name={"embededVideo"}
            fullWidth={true}
            defaultValue={defaultValues.videoLink}
          />
          {/* <textarea
              className="w-full border border-gray-300 py-10 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            /> */}
        </div>
        {/* Video Position */}
        {/* <div className="flex items-center px-3 justify-between gap-[98px] pb-3">
          <label className="w-56 text-sm text-[#5e5873] px-3">
            Video Position
          </label>
          <DSSelect
            fullWidth={true}
            defaultValue={"Select Position"}
            name={"videoPosition"}
            options={[
              "In product info (intro text area)",
              "Top product description",
              "Bottom product description",
              "Gallery Section",
            ]}
          />
        </div> */}
      </div>
    </div>
  );
};

export default MediaSection;
