"use client";
import Chat from "../../components/Chat";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../../utils/fontawesome";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import languages from "../../constants/languages";

config.autoAddCss = false;

const App = () => {
  const [favoriteLanguages, setFavoriteLanguages] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  const handleRemoveLanguage = (language) => {
    setFavoriteLanguages(favoriteLanguages.filter((lang) => lang !== language));
  };

  const handleAddLanguage = (language) => {
    if (!favoriteLanguages.includes(language)) {
      setFavoriteLanguages([...favoriteLanguages, language]);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query) {
      setFilteredLanguages(
        languages.filter((language) =>
          language.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredLanguages(languages);
    }
  };

  const colors = ["#FFE4B1", "#DEBEEC", "#B1DEFF"];

  return (
    <div className="app-container min-h-screen flex bg-[#e5e5e5]">
      <div className="sidebar flex flex-col">
        <div className="favorite-languages p-4 ">
          <h2 className="text-[40px] mb-2">Favorite Languages</h2>
          <ul className="language-list overflow-y-auto">
            {favoriteLanguages.map((language, index) => (
              <li
                key={language}
                className="flex justify-between items-center mb-2"
                style={{
                  color: "#000",
                  backgroundColor: colors[index % colors.length],
                  padding: "10px",
                  borderRadius: "20px",
                  display: "inline-block",
                }}
              >
                <span>{language}</span>
                <button
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => handleRemoveLanguage(language)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <button
            className="add-language-button mt-4"
            onClick={() => setShowSearch(true)}
          >
            +
          </button>
        </div>
        <div
          className={`language-search p-4 ${
            showSearch ? "animate-slide-up" : ""
          }`}
        >
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              className="p-2 border border-gray-300 rounded-[20px] w-full pr-10"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <ul className="mt-2">
            {filteredLanguages.map((language, index) => (
              <li
                key={language}
                className="flex justify-between items-center mb-2 cursor-pointer hover:font-bold"
                style={{
                  color: "#000",
                  padding: "5px",
                  borderRadius: "20px",
                  display: "inline-block",
                }}
                onClick={() => {
                  handleAddLanguage(language);
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                <span>{language}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="chat-area flex-1 flex flex-col items-center justify-center">
        <Chat favoriteLanguages={favoriteLanguages} />
      </div>
    </div>
  );
};

export default App;
