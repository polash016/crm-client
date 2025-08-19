"use client";
import DSInput from "@/components/Forms/DSInput";
import DSSelect from "@/components/Forms/DSSelect";
import React, { useState } from "react";

const OfferSetup = () => {
  // const [offers, setOffers] = useState({
  //   hotDeal: false,
  //   special: false,
  //   latest: false,
  // });

  // const handleToggle = (key) => {
  //   setOffers((prev) => ({ ...prev, [key]: !prev[key] }));
  // };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto space-y-12 mt-4">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white text-[18px] text-slate-700 px-4 py-3 rounded-t-xl font-semibold">
        Offer Setup
      </div>
      {/* Hot Deal */}
      <div className="space-y-6 px-4 ">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Hot Deal</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <DSInput
              name={"hotDeal"}
              type="checkbox"
              // checked={offers[key]}
            />
            {/* <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-white" /> */}
          </label>
        </div>
      </div>
      {/* Special */}
      <div className="space-y-6 px-4 ">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Special</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <DSInput
              name={"special"}
              type="checkbox"
              // checked={offers[key]}
            />
            {/* <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-white" /> */}
          </label>
        </div>
      </div>
      {/* Latest */}
      <div className="space-y-6 px-4 ">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Latest</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <DSInput
              name={"latest"}
              type="checkbox"
              // checked={offers[key]}
            />
            {/* <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-white" /> */}
          </label>
        </div>
      </div>
    </div>
  );
};

export default OfferSetup;
