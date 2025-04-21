import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

const BookContext = createContext();

const bookReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BOOK':
      return [...state, { ...action.payload, id: crypto.randomUUID() }];
    case 'UPDATE_BOOK':
      return state.map(book =>
        book.id === action.payload.id ? action.payload : book
      );
    case 'DELETE_BOOK':
      return state.filter(book => book.id !== action.payload);
    case 'SET_BOOKS':
      return action.payload;
    default:
      return state;
  }
};

export const BookProvider = ({ children }) => {
  const [books, dispatch] = useReducer(bookReducer, [], () => {
    try {
      const localData = localStorage.getItem('books');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Error loading books from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('books', JSON.stringify(books));
    } catch (error) {
      console.error('Error saving books to localStorage:', error);
    }
  }, [books]);

  const addBook = (book) => {
    try {
      const newBook = { ...book, id: crypto.randomUUID() };
      dispatch({ type: 'ADD_BOOK', payload: book });
    } catch (error) {
      console.error('Error adding book:', error);
      throw new Error('Gagal menambahkan buku');
    }
  };

  const updateBook = (book) => {
    try {
      if (!book.id) throw new Error('ID buku tidak valid');
      dispatch({ type: 'UPDATE_BOOK', payload: book });
    } catch (error) {
      console.error('Error updating book:', error);
      throw new Error('Gagal mengupdate buku');
    }
  };

  const deleteBook = (id) => {
    try {
      if (!id) throw new Error('ID buku tidak valid');
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (error) {
      console.error('Error deleting book:', error);
      throw new Error('Gagal menghapus buku');
    }
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
};

BookProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};