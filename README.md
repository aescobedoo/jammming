# Spotify Playlist Creator

Spotify Playlist Creator is a React web application that allows users to log in with their Spotify account, search for songs, view top recommendations, create custom playlists, and play music on their devices.

## Features

- **Login with Spotify**: Authenticate with your Spotify account.
- **Search for Songs**: Search for tracks using the Spotify API.
- **Top Recommendations**: View top recommended tracks based on your listening history.
- **Create Playlists**: Create and manage custom playlists.
- **Device Selection**: Choose a device to play music on.
- **Playback Controls**: Play and pause tracks directly from the app.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/spotify-playlist-creator.git
    cd spotify-playlist-creator
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Spotify credentials:
    ```env
    REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
    REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000
    ```

4. Start the development server:
    ```sh
    npm start
    ```

## Usage

1. **Login**: Click the "Login to Spotify" button to authenticate with your Spotify account.
2. **Search**: Use the search bar to find tracks.
3. **View Recommendations**: Top recommended tracks will be displayed automatically.
4. **Create Playlists**: Add tracks to your playlist and create a new playlist with a custom name and description.
5. **Device Selection**: Select a device to play music on from the dropdown menu.
6. **Playback**: Use the play and pause buttons to control playback.

## Components

- **App**: The main component that handles authentication, fetching data, and rendering child components.
- **Button**: A reusable button component.
- **SearchBar**: A component for searching tracks.
- **Results**: A component for displaying search results and recommendations.
- **PlaylistCreator**: A component for creating and managing playlists.
- **Dropdown**: A component for selecting playback devices.

## API Integration

This app uses the following Spotify Web API endpoints:

- **Authorization Endpoint**: `https://accounts.spotify.com/authorize`
- **Token Endpoint**: `https://accounts.spotify.com/api/token`
- **User Profile**: `https://api.spotify.com/v1/me`
- **Search**: `https://api.spotify.com/v1/search`
- **Top Tracks**: `https://api.spotify.com/v1/me/top/tracks`
- **Recommendations**: `https://api.spotify.com/v1/recommendations`
- **Create Playlist**: `https://api.spotify.com/v1/users/{user_id}/playlists`
- **Add Tracks to Playlist**: `https://api.spotify.com/v1/playlists/{playlist_id}/tracks`
- **Playback Devices**: `https://api.spotify.com/v1/me/player/devices`
- **Play**: `https://api.spotify.com/v1/me/player/play`
- **Pause**: `https://api.spotify.com/v1/me/player/pause`

## Customizing Styles

The appearance of the dropdown and other components can be customized using CSS. The `Dropdown.css` file contains styles for the dropdown component:

```css
#dropdown {
  width: 200px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('path/to/your-custom-arrow.png');
  background-position: right 10px center;
  background-repeat: no-repeat;
}

#dropdown:focus {
  border-color: #999;
}

#dropdown option {
  background-color: #ffffff;
  color: #333;
  padding: 8px;
}

#dropdown option:hover {
  background-color: #f0f0f0;
}
