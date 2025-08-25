import React from "react";

export default function MobileFrame({ children }) {
  return (
    <div className="w-full min-h-screen md:bg-gray-600 md:flex md:items-center md:justify-center">
      <div
        className="
          relative
          w-full h-screen
          md:w-[390px] md:max-w-[390px]
          md:h-[667px] md:my-3
          md:rounded-[28px] md:border-8 md:border-black
          md:bg-white md:shadow-2xl md:overflow-hidden
        "
      >
        {children}
      </div>
    </div>
  );
}
