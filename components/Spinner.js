import React from "react";

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-vulseGrey" viewBox="0 0 24 24">
      <circle
        className="opacity-25 fill-none stroke-gray-500"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className=" fill-vulseGrey"
        fill="vulseGrey"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );
}

export default Spinner;
