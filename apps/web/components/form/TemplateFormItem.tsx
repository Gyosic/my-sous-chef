"use client";

import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { PasswordField } from "./fields/PasswordField";
import { TextField } from "./fields/TextField";
import { TagField } from "./fields/TagField";

export interface FieldModel {
  name: string;
  type: string;
  placeholder?: string;
  desc?: string;
  accept?: string[];
  multiple?: boolean;
  readOnly?: boolean;
  unique?: boolean;
  inputCls?: string;
  unoptimized?: boolean;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  icon?: string;
  [key: string]: unknown;
}

export interface TemplateFormItemProps<
  T extends FieldValues,
  K extends FieldPath<T>,
> {
  fieldModel: FieldModel;
  field: ControllerRenderProps<T, K>;
  fieldState: ControllerFieldState;
  className?: string;
  labelPosition?: "top" | "left";
  labelCls?: string;
  isForm?: boolean;
  isDuplicate?: boolean;
  onDuplicateCheck?: (key: string, value: string) => void;
}

export function TemplateFormItem<T extends FieldValues, K extends FieldPath<T>>(
  props: TemplateFormItemProps<T, K>,
) {
  switch (props.fieldModel.type) {
    case "password":
      return <PasswordField {...props} />;
    case "tag":
      return <TagField {...props} />;
    default:
      return <TextField {...props} />;
  }
}
