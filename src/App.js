import React, { useState } from 'react';
import './App.css';

function App() {
  const [language, setLanguage] = useState('English');
  const [genre, setGenre] = useState('Pop');
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState(null);

  // Function to generate lyrics by making a POST request to the API
  const generateLyrics = async () => {
    console.log('Generate button clicked');  // Debugging log

    if (!description) {
      alert('Please provide a song description.');
      return;
    }

    const payload = {
      language: language,
      genre: genre,
      description: description,
    };

    console.log('Payload:', payload);  // Debugging log for payload

    try {
      // API call to FastAPI backend
      const response = await fetch('https://lyrics-api-2.onrender.com/generate_lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('API response:', response);  // Debugging log for API response

      if (!response.ok) {
        throw new Error('Failed to generate lyrics');
      }

      const data = await response.json();

      if (data.detail) {
        console.log('Error:', data.detail);  // Debugging log for API error response
        setError(data.detail);
      } else {
        console.log('Generated lyrics:', data.lyrics);  // Debugging log for generated lyrics
        const cleanLyrics = data.lyrics.replace(/\*/g, ''); // Clean asterisks if necessary
        setLyrics(cleanLyrics);
        setError(null);
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      setError('Error generating lyrics');
    }
  };

  return (
    <div className="container">
      <h1>AI-Assisted Music Production</h1>

      <div className="form-group">
        <label htmlFor="language">Language:</label>
        <input
          type="text"
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Enter song language (e.g., English)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Jazz">Jazz</option>
          <option value="Classical">Classical</option>
          <option value="Country">Country</option>
          <option value="R&B">R&B</option>
          <option value="Electronic">Electronic</option>
          <option value="Reggae">Reggae</option>
          <option value="Blues">Blues</option>
          <option value="Folk">Folk</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Describe the Song:</label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description of the song..."
        />
      </div>

      <button className="generate-button" onClick={generateLyrics}>Create/Update Lyrics</button>

      <div className="lyrics-output">
        <h2>Generated Lyrics</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <pre>{lyrics}</pre>
      </div>
    </div>
  );
}

export default App;
