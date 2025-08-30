"use client";
import { FormProvider, useForm } from "react-hook-form";

const DSForm = ({
  children,
  onSubmit,
  resolver,
  defaultValues,
  methods: externalMethods,
}) => {
  const internalMethods = useForm({
    resolver,
    defaultValues,
    mode: "all",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const methods = externalMethods || internalMethods;

  const {
    handleSubmit,
    formState: { errors },
    trigger, // Add trigger
  } = methods;

  const submit = async (data) => {
    // Trigger validation manually before submit
    const isValid = await trigger();
    if (isValid) {
      onSubmit(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>{children}</form>
    </FormProvider>
  );
};

export default DSForm;
