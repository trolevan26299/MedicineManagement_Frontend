import React, { useState } from 'react';
import InputMask from 'react-input-mask';

function PhoneNumberInputWithCode() {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div>
      <label htmlFor="phone">Phone Number</label>
      <InputMask
        mask="+84 999 999 999"
        maskChar="_"
        id="phone"
        placeholder="+84"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
    </div>
  );
}

export default PhoneNumberInputWithCode;
