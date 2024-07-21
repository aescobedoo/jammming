import React from "react";

export default function Search({handleInput, searchValue, handleClear}) {
  return (
    <form className="SearchBar">
      <input
        id="textInput"
        type="text"
        name="searchInput"
        placeholder="Search a song..."
        onInput={handleInput}
        autoComplete="off"
        value={searchValue}
      />
      <button className="clear" onClick={handleClear}>X</button>
    </form>
  );
}