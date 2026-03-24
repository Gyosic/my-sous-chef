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
import { createContext, useContext } from "react";
import { TextareaField } from "@/components/form/fields/TextareaField";
import { NestedField } from "@/components/form/fields/NestedField";
import { NumberField } from "@/components/form/fields/NumberField";
import { ToggleField } from "@/components/form/fields/ToggleField";

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
  inputCls?: string;
  isForm?: boolean;
  isDuplicate?: boolean;
  onDuplicateCheck?: (key: string, value: string) => void;
}

interface TemplateFormItemContextValue {
  fieldModel: FieldModel;
  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
  fieldState: ControllerFieldState;
  className?: string;
  labelPosition?: "top" | "left";
  labelCls?: string;
  inputCls?: string;
  isForm?: boolean;
  isDuplicate?: boolean;
  onDuplicateCheck?: (key: string, value: string) => void;
}

export const TemplateFormItemContext =
  createContext<TemplateFormItemContextValue | null>(null);

export function useTemplateFormItem() {
  const ctx = useContext(TemplateFormItemContext);
  if (!ctx) {
    throw new Error("useTemplateFormItem must be used within TemplateFormItem");
  }
  return ctx;
}

export function TemplateFormItem<T extends FieldValues, K extends FieldPath<T>>(
  props: TemplateFormItemProps<T, K>,
) {
  const getInputField = (type: string) => {
    switch (type) {
      case "password":
        return <PasswordField />;
      case "tag":
        return <TagField />;
      case "textarea":
        return <TextareaField />;
      case "nested":
        return <NestedField />;
      case "number":
        return <NumberField />;
      case "toggle":
        return <ToggleField />;
      default:
        return <TextField />;
    }
  };

  return (
    <TemplateFormItemContext.Provider
      value={props as TemplateFormItemContextValue}
    >
      {getInputField(props.fieldModel.type)}
    </TemplateFormItemContext.Provider>
  );
}
