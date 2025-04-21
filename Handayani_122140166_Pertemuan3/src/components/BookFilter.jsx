import PropTypes from 'prop-types';

const BookFilter = ({ onFilterChange, onSearchChange }) => {
  return (
    <div className="book-filter">
      <div className="filter-group">
        <label htmlFor="status-filter">Filter Status:</label>
        <select
          id="status-filter"
          onChange={(e) => onFilterChange(e.target.value)}
          defaultValue="semua"
        >
          <option value="semua">Semua</option>
          <option value="dimiliki">Dimiliki</option>
          <option value="dibaca">Sedang Dibaca</option>
          <option value="ingin_beli">Ingin Dibeli</option>
        </select>
      </div>

      <div className="search-group">
        <label htmlFor="search">Cari Buku:</label>
        <input
          type="text"
          id="search"
          placeholder="Cari judul atau penulis..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

BookFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default BookFilter;