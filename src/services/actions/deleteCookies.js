"use server";
import { cookies } from "next/headers";

export const deleteCookies = async (keys) => {
  const cookieStore = await cookies();
  for (const key of keys) {
    cookieStore.delete(key); // No await here
  }
};
