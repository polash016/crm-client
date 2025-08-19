"use client";
export const modifyPayload = (values: any) => {
  const formData = new FormData();
  const obj = { ...values };
  const file = obj["file"];
  delete obj["file"];
  const data = JSON.stringify(obj);

  formData.append("data", data);

  formData.append("file", file as Blob);

  return formData;
};

export const modifyEventPayload = (values: any) => {
  const formData = new FormData();
  const obj = { ...values };

  const eventImg = obj["events"];
  delete obj["events"];

  const guestImg = obj["guestImg"];
  delete obj["guestImg"];

  const data = JSON.stringify(obj);

  formData.append("data", data);

  if (eventImg && Array.isArray(eventImg)) {
    eventImg.forEach((file: File) => {
      formData.append("events", file);
    });
  }

  if (guestImg) {
    formData.append("guestImg", guestImg as File);
  }

  return formData;
};
