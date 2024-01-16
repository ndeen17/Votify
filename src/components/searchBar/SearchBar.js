import "./searchBar.css";

import { FiSearch } from "react-icons/fi";

export default function SearchBar({ searchState, placeholder }) {
  const [search, setSearch] = searchState;
  return (
    <div className="SearchBar">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
      />
      <span>
        <FiSearch className="SearchBarIcon" />
      </span>
    </div>
  );
}
