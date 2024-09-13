import React from "react";

const Input = ({ type, value, setType, className, placeholder }) => {
  return (
    <>
      <input
      placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => setType(e.target.value)}
        className={className}
        required
      />
    </>
  );
};

export default Input;
