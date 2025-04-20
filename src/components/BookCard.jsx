import PropTypes from 'prop-types';

const BookCard = ({ book, onEdit, onDelete }) => {
  const { title, author, status } = book;

  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p>Penulis: {author}</p>
      <p>Status: {status}</p>
      <div className="book-actions">
        <button onClick={() => onEdit(book)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(book.id)} className="delete-btn">
          Hapus
        </button>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookCard;