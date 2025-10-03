import React from "react";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  disabledStyle?: boolean;
};

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`cursor-pointer px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
        props.disabledStyle && "bg-slate-700 border-slate-600"
      }`}
    >
      {props.children}
    </button>
  );
};

export default Button;
