'use client';

import type { LucideIcon } from 'lucide-react';
import { createElement } from 'react';

import { useDynamicIcon } from '@repo/ui/hooks/use-lucide-icon';
import { cn } from '@repo/ui/lib/utils';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@repo/ui/components/field';
import { ControllerFieldState } from 'react-hook-form';

interface FormItemWrapperProps {
  children: React.ReactNode;
  isForm: boolean;
  name: string;
  desc?: string;
  labelCls?: string;
  className?: string;
  formLabel?: React.ReactNode;
  icon?: LucideIcon | string;
  fieldState: ControllerFieldState
}

export function FormItemWrapper({
  children,
  name,
  desc,
  labelCls,
  isForm,
  className,
  formLabel,
  icon,
  fieldState,
}: FormItemWrapperProps) {
  const iconComponent = useDynamicIcon(icon);

  if (!isForm) return <>{children}</>;

  return (
    <Field className={cn(className)}>
      {formLabel ? (
        formLabel
      ) : (
        <FieldLabel className={cn(labelCls)}>
          {iconComponent &&
            createElement(iconComponent, { className: 'size-4' })}{' '}
          {name}
        </FieldLabel>
      )}
      {children}
      {desc && (
        <FieldDescription className="text-gray-500 text-xs">
          {desc}
        </FieldDescription>
      )}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
