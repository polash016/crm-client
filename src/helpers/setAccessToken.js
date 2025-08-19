"use server";
import { authKey } from "@/constant/authKey";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const setAccessToken = async (token, option) => {
  const cookieStore = await cookies();
  cookieStore.set(authKey, token); // No await here

  if (option && option.redirect) {
    redirect(option.redirect);
  }
};

export default setAccessToken;

// "use server";

// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

// export async function setAccessToken(token, option) {
//   const cookieStore = await cookies();
//   cookieStore.set('accessToken', token, {
//     httpOnly: true,
//     path: '/',
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     ...option,
//   });

//   if (option && option.redirect) {
//     redirect(option.redirect);
//   }
// }
// export default setAccessToken;
