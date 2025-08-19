"use client";
import { components } from "@/database/landing";
import { useParams } from "next/navigation";

const DynamicLandingPage = () => {
  const { page } = useParams();

  const Component = components[page];

  return Component ? (
    <Component />
  ) : (
    <div className="text-center">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className=" mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default DynamicLandingPage;
