import React from "react";
import { TextField as MUITextField } from "@material-ui/core";

const TextField = ({ name, label, errors, register, defaultValue }) => (
  <MUITextField
    variant="outlined"
    size="small"
    fullWidth
    name={name}
    label={label}
    inputRef={register}
    error={!!errors[name]}
    helperText={errors[name]?.message}
    defaultValue={defaultValue}
  />
);

export default TextField;
