import { useState, useMemo } from 'react';
import { useBooks } from '../context/BookContext';

export const useBookFilter = () => {
  const { books } = useBooks();
  const [statusFilter, setStatusFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesStatus = statusFilter === 'semua' || book.status === statusFilter;
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [books, statusFilter, searchQuery]);

  return {
    filteredBooks,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery
  };
};