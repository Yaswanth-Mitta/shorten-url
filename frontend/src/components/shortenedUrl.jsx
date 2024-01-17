import { useState, useEffect } from "react";
import "./ShortenUrlApp.css"; // Import your CSS file for styling

const ShortenUrlApp = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  // const [clickCount, setClickCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the initial click count when the component mounts
    const fetchClickCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/clickCount");
        if (response.ok) {
          // const result = await response.json();
          // setClickCount(result.clickCount);
        } else {
          console.error("Failed to fetch click count");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchClickCount();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleUrlChange = (e) => {
    setOriginalUrl(e.target.value);
  };

  const handleShortenUrl = async () => {
    try {
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const result = await response.json();
      setShortenedUrl(`http://localhost:5000/${result.shortUrl}`);
      setError("");
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      console.error(err);
    }
  };

  const handleRedirect = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/${shortenedUrl.split("/").pop()}`
      );
      if (response.ok) {
        // Increment the click count in the state
        // setClickCount((prevClickCount) => prevClickCount + 1);
        window.location.href = response.url;
      } else {
        console.error("URL not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="shorten-url-container">
        <h1>URL Shortener</h1>
        <div className="url-input-container">
          <label>
            Paste your long URL here:
            <input type="text" value={originalUrl} onChange={handleUrlChange} />
          </label>
          <button onClick={handleShortenUrl}>Shorten URL</button>
        </div>
        {shortenedUrl && (
          <div className="result-container">
            <h2>Shortened URL:</h2>
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRedirect}
            >
              {shortenedUrl}
            </a>
            {/* <p>Click Count: {clickCount}</p> */}
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
  );
};

export default ShortenUrlApp;
