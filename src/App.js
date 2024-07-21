import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Button";
import Search from "./components/SearchBar";
import Results from "./components/Results";
import PlaylistCreator from "./components/PlaylistCreator";

const CLIENT_ID = "f7a35419aa8a4e0dbb1eab58c1d447e3"; // your clientId
const REDIRECT_URI = "http://localhost:3000"; // your redirect URL
const AUTHORIZATION_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPE =
  "user-top-read user-library-modify playlist-read-private playlist-modify-private playlist-modify-public user-read-private user-read-email";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const redirectToSpotifyAuthorize = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    localStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPE,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    });

    window.location.href = `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
  };

  const getToken = async (code) => {
    const codeVerifier = localStorage.getItem("code_verifier");

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("expires_in", data.expires_in);
      const now = new Date();
      const expiry = new Date(now.getTime() + data.expires_in * 1000);
      localStorage.setItem("expires", expiry.toISOString());
      setToken(data.access_token);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("expires_in", data.expires_in);
      const now = new Date();
      const expiry = new Date(now.getTime() + data.expires_in * 1000);
      localStorage.setItem("expires", expiry.toISOString());
      setToken(data.access_token);
    }
  };

  const isTokenExpired = () => {
    const expiry = new Date(localStorage.getItem("expires"));
    const now = new Date();
    return now >= expiry;
  };

  const fetchWebApi = async (endpoint, method, body) => {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !token) {
      getToken(code);
    } else if (token && isTokenExpired()) {
      refreshToken();
    } else if (token) {
      getUserData();
    }
  }, [token]);

  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    const data = await fetchWebApi("v1/me", "GET");
    setUserData(data);
  };

  const login = () => {
    redirectToSpotifyAuthorize();
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserData(null);
  };

  const [search, setSearch] = useState("");

  const handleInput = ({ target }) => {
    setSearch(target.value.toLowerCase());
  };

  const clearSearch = (e) => {
    e.preventDefault();
    setSearch("");
    setSongs([]);
  }
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    if (!search) return;
    try {
      const data = await fetchWebApi(`v1/search?q=${search}&type=track`, "GET");
      setSongs(data.tracks.items);
    } catch (err) {
      console.log(err);
    }
  };

  const [seed_tracks, setSeedTracks] = useState(null);

  const fetchTopTracks = async () => {
    try {
      const data = await fetchWebApi(
        `v1/me/top/tracks?time_range=short_term&limit=5`,
        "GET"
      );
      console.log(data.items);
      setSeedTracks(data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTopTracks();
  }, [token]);

  useEffect(() => {
    if (search) {
      fetchSongs();
    }
  }, [search]);

  const [recomended, setRecomended] = useState([]);

  const fetchRecomended = async () => {
    if (!seed_tracks) return;
    try {
      const data = await fetchWebApi(
        `v1/recommendations?limit=5&seed_tracks=${seed_tracks
          .map((track) => track.id)
          .join(",")}`,
        "GET"
      );
      setRecomended(data.tracks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecomended();
  }, [seed_tracks]);

  const [playlistName, setPlaylistName] = useState("");

  const handleTitleInput = ({ target }) => {
    setPlaylistName(target.value);
  };

  const [playlistDescription, setPlaylistDescription] = useState("");

  const handleDesInput = ({ target }) => {
    setPlaylistDescription(target.value);
  };

  const addPlaylist = async (e) => {
    e.preventDefault();
    const tracksUri = playlist.map((song) => song.uri);
    try {
      const createPlaylist = async (tracksUri) => {
        const { id: user_id } = await fetchWebApi("v1/me", "GET");

        const playlist = await fetchWebApi(
          `v1/users/${user_id}/playlists`,
          "POST",
          {
            name: playlistName,
            description: playlistDescription,
            public: false,
          }
        );

        await fetchWebApi(
          `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
          "POST"
        );

        return playlist;
      };

      const createdPlaylist = await createPlaylist(tracksUri);
      console.log(createdPlaylist.name, createdPlaylist.id);

      // Clear input fields
      setPlaylistName("");
      setPlaylistDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  const [playlist, setPlaylist] = useState([]);

  const addToPlaylist = (song) => {
    console.log(song);
    setPlaylist((prev) => [...prev, song]);
  };

  const removeFromPlaylist = (song) => {
    setPlaylist((prev) => {
      const index = prev.findIndex((s) => s.id === song.id);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="App">
      {!token ? (
        <Button onClick={login} text={"Login to Spotify"} id={"login"} />
      ) : (
        <Button onClick={logout} text={"Log out"} id={"logout"} />
      )}
      {userData && (
        <>
          <h1>Welcome{", " + userData.display_name}</h1>
          <Search handleInput={handleInput} searchValue={search} handleClear={clearSearch}/>
          <div className="columns">
            <div className="left">
              <h2>Top Recomendations</h2>
              <Results
                render={recomended}
                handleClick={addToPlaylist}
                buttonText={"Add to playlist"}
              />
              <h2>Search</h2>
              <Results
                render={songs}
                handleClick={addToPlaylist}
                buttonText={"Add to playlist"}
              />
            </div>
            <div className="right">
              <PlaylistCreator
                handleTitleInput={handleTitleInput}
                titleValue={playlistName}
                handleDesInput={handleDesInput}
                desValue={playlistDescription}
                handleSubmit={addPlaylist}
              />
              <Results
                render={playlist}
                handleClick={removeFromPlaylist}
                buttonText={"remove"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
