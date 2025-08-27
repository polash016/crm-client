"use server";
import { authKey } from "@/constant/authKey";
import { cookies } from "next/headers";
import { use } from "react";

export async function getUserById(userId, request) {
  // Use INTERNAL_API_URL for server-side calls (middleware)
  const baseUrl =
    process.env.NEXT_PUBLIC_SHEBA_API_URL || "http://localhost:5000/api/v1";
  const apiUrl = `${baseUrl}/users/${userId}`;

  try {
    const accessToken = await request?.cookies.get(authKey)?.value;

    if (!accessToken) {
      throw new Error("Access token not found in cookies.");
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    throw error;
  }
}
