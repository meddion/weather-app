import React from 'react';
import './Search.css';

const Search = ({ onSubmit, onChange, value, children }) => {
  return (
    <div className="Search">
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} type="text" />
        <button type="submit">{children}</button>
      </form>
    </div>
  );
};

export default Search;
