import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from JSON file on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/data.json'); // Assuming data.json is in public folder
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterSuggestions = (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = data.reduce((acc, artist) => {
      const albums = artist.albums.reduce((albumAcc, album) => {
        const songs = album.songs.filter(song =>
          song.title.toLowerCase().includes(input.toLowerCase())
        );
        if (songs.length) {
          albumAcc.push({ ...album, songs });
        }
        return albumAcc;
      }, []);

      if (albums.length) {
        acc.push({ ...artist, albums });
      }
      return acc;
    }, []);

    setSuggestions(filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    filterSuggestions(value); // Pass the full input value to filterSuggestions
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.title); // Assuming suggestion is an object with a title field
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      setInputValue(suggestions[0].title); // Select the first suggestion on Enter
      setSuggestions([]);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Music Library</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div className="autocomplete">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for songs..."
        />
        <ul className="suggestion-list">
          {suggestions.map((artist, index) => (
            <li key={index}>
              <div className="artist-name">{artist.name}</div>
              <ul className="album-list">
                {artist.albums.map((album, idx) => (
                  <li key={idx}>
                    <div className="album-title">{album.title}</div>
                    <ul className="song-list">
                      {album.songs.map((song, i) => (
                        <li key={i} onClick={() => handleSuggestionClick(song)}>
                          <span className="song-title">
                            {song.title.toLowerCase().includes(inputValue.toLowerCase()) ? (
                              <>
                                {song.title.substr(0, song.title.toLowerCase().indexOf(inputValue.toLowerCase()))}
                                <span className="highlight">
                                  {song.title.substr(song.title.toLowerCase().indexOf(inputValue.toLowerCase()), inputValue.length)}
                                </span>
                                {song.title.substr(song.title.toLowerCase().indexOf(inputValue.toLowerCase()) + inputValue.length)}
                              </>
                            ) : (
                              song.title
                            )}
                          </span>
                          <span className="song-length">{song.length}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
