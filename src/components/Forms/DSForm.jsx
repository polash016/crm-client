"use client";
import { FormProvider, useForm } from "react-hook-form";

const DSForm = ({ children, onSubmit, resolver, defaultValues }) => {
  const methods = useForm({
    resolver,
    defaultValues,
    mode: "all",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors },
    trigger, // Add trigger
  } = methods;

  const submit = async (data) => {
    // Trigger validation manually before submit
    const isValid = await trigger();
    console.log("Validation triggered:", { isValid, errors });
    if (isValid) {
      onSubmit(data);
    }
  };

  // Log errors whenever they change
  console.log("Form Errors:", errors);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>{children}</form>
    </FormProvider>
  );
};

export default DSForm;
