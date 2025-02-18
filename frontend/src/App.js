import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [feedUrl, setFeedUrl] = useState('');
  const [feedData, setFeedData] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/feed?url=${feedUrl}`);
      setFeedData(res.data);
    } catch (error) {
      console.error("Error fetching RSS feed", error);
    }
  };

  const handleArticleClick = async (link) => {
    try {
      const res = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(link)}`);
      const parser = new DOMParser();
      const doc = parser.parseFromString(res.data.contents, "text/html");
  
      // Extract main content (Modify this selector based on the site)
      let articleContent = doc.querySelector("article") || doc.querySelector(".post-content") || doc.querySelector(".content") || doc.body;
  
      // If content is found, set it
      if (articleContent) {
        setSelectedArticle(articleContent.innerHTML);
      } else {
        setSelectedArticle("<p>Failed to load article content. Try opening it manually.</p>");
      }
  
    } catch (error) {
      console.error("Error fetching article content", error);
      setSelectedArticle("<p>Error loading article.</p>");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">RSS Reader</h2>
      <input
        type="text"
        placeholder="Enter RSS Feed URL"
        value={feedUrl}
        onChange={(e) => setFeedUrl(e.target.value)}
        className="border p-2 m-2"
      />
      <button onClick={fetchFeed} className="bg-blue-500 text-white p-2">
        Fetch Feed
      </button>

      {/* Show Article List if No Article is Selected */}
    {!selectedArticle && feedData && (
      <div className="mt-4">
        <h3 className="text-xl font-semibold">{feedData.title}</h3>
        <ul>
          {feedData.items.map((item, index) => (
            <li key={index} className="mt-2">
              <button
                className="text-blue-500 hover:underline w-full text-left"
                onClick={() => handleArticleClick(item.link)}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Show Full Article Content */}
    {selectedArticle && (
      <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
        <button
          className="bg-gray-300 px-3 py-1 rounded-md mb-4"
          onClick={() => setSelectedArticle(null)}
        >
          ← Back to Articles
        </button>
        <div className="overflow-y-auto max-h-[500px] p-3 border rounded-md bg-gray-100">
          <div dangerouslySetInnerHTML={{ __html: selectedArticle }} />
        </div>
      </div>
    )}
  </div>
);
}

export default App;