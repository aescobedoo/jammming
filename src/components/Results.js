import React from "react";

export default function Results({render, handleClick, buttonText}) {
  return (
    <ul>
      {render.map((item) => (
        <li key={item.id}>
          <h3>{item.name}</h3>
          <h4>{item.artists.map((artist) => artist.name).join(", ")}</h4>
          <button onClick={() => handleClick(item)}>{buttonText}</button>
        </li>
      ))}
    </ul>
  );
}