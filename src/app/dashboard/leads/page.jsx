"use client";
import LeadsTable from "@/components/Dashboard/Leads/LeadsTable";
import { Button } from "@mui/material";
import React from "react";

const page = () => {
  const handleDownload = () => {
    // Define the CSV headers (no data rows for an empty file)
    const headers = ["name", "phone", "address", "items", "price"]; //'name,phone,address,items,price\n';

    const paddedHeaders = headers.map(
      (header) => `${header}                            `
    );

    const csvHeaders =
      paddedHeaders.map((header) => `"${header}"`).join(",") + "\r\n";

    // Create a Blob with the CSV content
    const blob = new Blob([csvHeaders], { type: "text/csv;charset=utf-8;" });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads-sample.csv"; // Filename for the downloaded file
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* <Button variant="contained" color="primary" onClick={handleDownload}>
            Download CSV Sample
          </Button> */}
      <LeadsTable />
    </div>
  );
};

export default page;
