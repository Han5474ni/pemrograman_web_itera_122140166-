import { useMemo } from 'react';
import { useBooks } from '../context/BookContext';

export const useBookStats = () => {
  const { books } = useBooks();

  const stats = useMemo(() => {
    return {
      total: books.length,
      dimiliki: books.filter(book => book.status === 'dimiliki').length,
      dibaca: books.filter(book => book.status === 'dibaca').length,
      ingin_beli: books.filter(book => book.status === 'ingin_beli').length
    };
  }, [books]);

  return stats;
};