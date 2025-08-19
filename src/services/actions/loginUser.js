// "use server";
import setAccessToken from "@/helpers/setAccessToken";
import { storeUserInfo } from "../auth.service";

export const loginUser = async (payload) => {
  try {
    console.log(payload);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHEBA_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        credentials: "include",
      }
    );

    const user = await res.json();

    if (user?.data?.accessToken) {
      setAccessToken(user?.data?.accessToken);
      // storeUserInfo(user?.data?.accessToken);
    }

    return user;
  } catch (error) {
    console.log(error);
  }
};
