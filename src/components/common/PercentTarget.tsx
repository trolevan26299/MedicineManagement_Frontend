import React, { useState, useEffect } from 'react';

interface PercentageInputProps {
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
}

const PercentageInput: React.FC<PercentageInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🚀 ~ file: PercentTarget.tsx:13 ~ handleChange ~ newValue:', newValue);

    if (/^\d+(\.\d{0,2})?%?$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  useEffect(() => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  }, [inputValue, onChange]);

  const formattedValue = inputValue.endsWith('%') ? inputValue : `${inputValue}%`;

  return <input type="text" value={formattedValue} onChange={handleChange} />;
};

export default PercentageInput;
