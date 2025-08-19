"use client";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DSMultipleSelect = ({
  name,
  label,
  options,
  size = "small",
  fullWidth = true,
  required = false,
  disabled = false,
  isLoading = false,
  isError = false,
  onChange,
  defaultValue = [],
}) => {
  const theme = useTheme();
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const getNestedError = (errors, path) => {
    const fields = path.split(".");
    return fields.reduce((acc, field) => acc?.[field], errors);
  };

  const fieldError = getNestedError(errors, name);

  const shouldDisable = disabled || isLoading || isError;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue || []}
      render={({
        field: { onChange: fieldOnChange, value, ...field },
        fieldState: { error },
      }) => (
        <FormControl
          size={size}
          fullWidth={fullWidth}
          // required={required}
          error={!!error?.message || isError}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            multiple
            value={value || []}
            onChange={async (e) => {
              fieldOnChange(e);
              await trigger(name);
              if (onChange) onChange(e);
            }}
            input={<OutlinedInput label={label} />}
            MenuProps={MenuProps}
            // defaultValue={defaultValue}
            disabled={shouldDisable}>
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id} disabled={isLoading}>
                {option.name || option}
              </MenuItem>
            ))}
          </Select>
          {fieldError ? (
            <p style={{ color: theme.palette.error.main }}>
              {fieldError?.message}
            </p>
          ) : isError ? (
            <p style={{ color: theme.palette.error.main }}>
              Error loading data
            </p>
          ) : null}
        </FormControl>
      )}
    />
  );
};

export default DSMultipleSelect;
