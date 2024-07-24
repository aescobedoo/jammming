import React from "react";

export default function Results({render, handleClick, buttonText, handleSong}) {
  return (
    <ul className="result">
      {render.map((item) => (
        <li key={item.id}>
          <div className="text">
            <h3>{item.name}</h3>
            <h4>{item.artists.map((artist) => artist.name).join(", ")}</h4>
            <h5>{item.album.name}</h5>
          </div>
          <div className="buttons">
            <button onClick={() => handleClick(item)}>{buttonText}</button>
            <button onClick={() => handleSong(item)}>▶︎</button>
          </div>
        </li>
      ))}
    </ul>
  );
}