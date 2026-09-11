'use client';

import React from 'react';

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | string;
  onChange: (val: number | string) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function NumericInput({
  value,
  onChange,
  min,
  max,
  className = '',
  onFocus,
  onBlur,
  ...props
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const num = Number(raw);
    if (!isNaN(num)) {
      onChange(raw);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0' || e.target.value === '00') {
      e.target.select();
    }
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value === '' || value === null || value === undefined) {
      if (min !== undefined) {
        onChange(min);
      } else {
        onChange(0);
      }
    } else {
      const num = Number(value);
      if (isNaN(num)) {
        onChange(min !== undefined ? min : 0);
      } else if (min !== undefined && num < min) {
        onChange(min);
      } else if (max !== undefined && num > max) {
        onChange(max);
      }
    }
    if (onBlur) onBlur(e);
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      {...props}
    />
  );
}
