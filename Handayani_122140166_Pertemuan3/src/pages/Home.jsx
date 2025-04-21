import { useState } from 'react';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import BookFilter from '../components/BookFilter';
import { useBooks } from '../context/BookContext';
import { useBookFilter } from '../hooks/useBookFilter';

const Home = () => {
  const { addBook, updateBook, deleteBook } = useBooks();
  const { filteredBooks, setStatusFilter, setSearchQuery } = useBookFilter();
  const [editingBook, setEditingBook] = useState(null);

  const handleSubmit = (bookData) => {
    if (editingBook) {
      updateBook({ ...bookData, id: editingBook.id });
      setEditingBook(null);
    } else {
      addBook(bookData);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleDelete = (id) => {
    deleteBook(id);
  };

  const handleCancel = () => {
    setEditingBook(null);
  };

  return (
    <div className="home">
      <h1>Manajemen Buku Pribadi</h1>
      
      <BookFilter
        onFilterChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <BookForm
        book={editingBook}
        onSubmit={handleSubmit}
        onCancel={editingBook ? handleCancel : undefined}
      />

      <div className="book-list">
        {filteredBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;