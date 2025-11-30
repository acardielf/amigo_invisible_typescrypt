import type { ReactNode } from 'react';

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
};

type InputProps = BaseProps & {
  type: 'text' | 'email';
  register: Record<string, unknown>;
  placeholder?: string;
  maxLength?: number;
};

type TextareaProps = BaseProps & {
  type: 'textarea';
  register: Record<string, unknown>;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

type SelectProps = BaseProps & {
  type: 'select';
  register: Record<string, unknown>;
  placeholder?: string;
  disabled?: boolean;
  children: ReactNode;
};

type FormFieldProps = InputProps | TextareaProps | SelectProps;

export const FormField = (props: FormFieldProps) => {
  const { label, name, error, required = false } = props;
  const fieldId = `field-${name}`;
  const errorId = `${name}-error`;

  const baseClassName = `input-field ${error ? 'input-error' : ''}`;
  const ariaProps = {
    'aria-invalid': error ? ('true' as const) : ('false' as const),
    'aria-describedby': error ? errorId : undefined,
  };

  const renderField = () => {
    if (props.type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          {...props.register}
          className={baseClassName}
          placeholder={props.placeholder}
          rows={props.rows || 3}
          maxLength={props.maxLength}
          {...ariaProps}
        />
      );
    }

    if (props.type === 'select') {
      return (
        <select
          id={fieldId}
          {...props.register}
          className={baseClassName}
          disabled={props.disabled}
          {...ariaProps}
        >
          {props.placeholder && <option value="">{props.placeholder}</option>}
          {props.children}
        </select>
      );
    }

    return (
      <input
        id={fieldId}
        type={props.type}
        {...props.register}
        className={baseClassName}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        {...ariaProps}
      />
    );
  };

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500" aria-label="required"> *</span>}
      </label>
      {renderField()}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
