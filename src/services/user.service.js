"use server";
import { authKey } from "@/constant/authKey";
import { cookies } from "next/headers";
import { use } from "react";

export async function getUserById(userId, request) {
  // Use INTERNAL_API_URL for server-side calls (middleware)
  const baseUrl =
    process.env.NEXT_PUBLIC_SHEBA_API_URL || "http://localhost:5000/api/v1";
  const apiUrl = `${baseUrl}/users/${userId}`;
  console.log("getUserById: API URL:", apiUrl);
  console.log("getUserById: Internal API URL:", process.env.INTERNAL_API_URL);
  console.log(
    "getUserById: Public API URL:",
    process.env.NEXT_PUBLIC_SHEBA_API_URL
  );

  try {
    const accessToken = await request?.cookies.get(authKey)?.value;

    if (!accessToken) {
      throw new Error("Access token not found in cookies.");
    }

    console.log(
      "getUserById: Making request with token:",
      accessToken ? "present" : "missing"
    );

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });

    console.log("getUserById: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("getUserById: Error response:", errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const userData = await response.json();
    console.log("getUserById: Success, got user data");
    return userData;
  } catch (error) {
    console.error("getUserById: Error fetching user data:", error);
    throw error;
  }
}
