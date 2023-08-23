import React from 'react';
import DatePicker from 'react-datepicker';
import '../assets/css/common/date-picker.css';

const CommonDatePicker = ({
  selectedDate,
  setSelecteDate,
  format,
  placeholder,
  name,
  handleBlur,
}: {
  selectedDate?: Date;
  setSelecteDate?: (_: Date | null) => void;
  format?: string;
  placeholder?: string;
  name?: string;
  handleBlur?: () => void;
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => 1900 + index);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const handleChange = (date: Date | null) => {
    setSelecteDate?.(date);
  };
  return (
    <div className="div_react_datePicker">
      <DatePicker
        onBlur={handleBlur}
        name={name}
        placeholderText={placeholder}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat={format}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
            }}
            className="datepicker-popup"
          >
            <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[date.getMonth()]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      />
    </div>
  );
};

export default CommonDatePicker;
