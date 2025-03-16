import { useState } from "react";
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setWord(event.target.value);
  };

  const fetchData = async () => {
    if (!word) {
      setError("Please enter a word to search");
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/${word}"
      );
      if (!response.ok) {
        if (response.status === 404) {
          setError("Word not found");
        } else {
          throw new Error("Failed to fetch data");
        }
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>By Jackiline Nderi</h1>
        <p>Type a word to find its meaning</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Type a word to search"
          value={word}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Enter a word to search"
        />
        <button onClick={fetchData} disabled={loading} aria-busy={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {data &&
        data.map((entry, index) => (
          <div key={index} className="result">
            <h2>{entry.word}</h2>
            {entry.meanings.map((meaning, mIndex) => (
              <div key={mIndex} className="meaning">
                <h3>{meaning.partOfSpeech}</h3>
                {meaning.definitions.map((definition, dIndex) => (
                  <div key={dIndex} className="definition">
                    <p>{definition.definition}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default App;