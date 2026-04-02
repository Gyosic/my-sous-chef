"use client";

import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { createContext, useContext } from "react";
import dynamic from "next/dynamic";
const PasswordField = dynamic(() =>
  import("@/components/form/fields/PasswordField").then(
    (mod) => mod.PasswordField,
  ),
);

const TextField = dynamic(() =>
  import("@/components/form/fields/TextField").then((mod) => mod.TextField),
);
const TagField = dynamic(() =>
  import("@/components/form/fields/TagField").then((mod) => mod.TagField),
);
const TextareaField = dynamic(() =>
  import("@/components/form/fields/TextareaField").then(
    (mod) => mod.TextareaField,
  ),
);
const NestedField = dynamic(() =>
  import("@/components/form/fields/NestedField").then((mod) => mod.NestedField),
);
const NumberField = dynamic(() =>
  import("@/components/form/fields/NumberField").then((mod) => mod.NumberField),
);
const ToggleField = dynamic(() =>
  import("@/components/form/fields/ToggleField").then((mod) => mod.ToggleField),
);
const DateField = dynamic(() =>
  import("@/components/form/fields/DateField").then((mod) => mod.DateField),
);

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
      case "date":
        return <DateField />;
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
