import React from "react";

export default function Button({onClick, text, id, }) {
  return (
    <button id={id} onClick={onClick}>
      {text}
    </button>
  )
}