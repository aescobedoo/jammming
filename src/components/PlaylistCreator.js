import React from "react";

export default function PlaylistCreator({
  handleTitleInput,
  titleValue,
  handleDesInput,
  desValue,
  handleSubmit,
}) {
  return (
    <div className="creator">
      <h2>Playlist Creator</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Playlist Name"
          id="title"
          onInput={handleTitleInput}
          value={titleValue}
        />
        <textarea
          placeholder="Playlist Description"
          id="description"
          onInput={handleDesInput}
          value={desValue}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
