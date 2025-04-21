import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BookProvider, useBooks } from './BookContext';
import { renderWithProvider } from '../test/setup';

describe('BookContext', () => {
  const TestComponent = () => {
    const { books, addBook, updateBook, deleteBook } = useBooks();
    return (
      <div>
        <div data-testid="book-count">{books.length}</div>
        <button onClick={() => addBook({ title: 'Test Book', author: 'Test Author', status: 'dimiliki' })}>
          Add Book
        </button>
        <button onClick={() => updateBook({ id: books[0]?.id, title: 'Updated Book', author: 'Updated Author', status: 'dibaca' })}>
          Update Book
        </button>
        <button onClick={() => deleteBook(books[0]?.id)}>
          Delete Book
        </button>
      </div>
    );
  };

  const mockBook = {
    title: 'Test Book',
    author: 'Test Author',
    status: 'dimiliki'
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('allows user to add a new book', async () => {
    renderWithProvider(<TestComponent />);
    
    const addButton = screen.getByText('Add Book');
    fireEvent.click(addButton);

    expect(await screen.findByText('Test Book')).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('allows user to update book status', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([{ ...mockBook, id: '1' }]));
    
    renderWithProvider(<TestComponent />);
    const updateButton = screen.getByText('Update Book');
    
    await act(async () => {
      fireEvent.click(updateButton);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'books',
      expect.stringContaining('"status":"dibaca"')
    );
  });

  it('persists books between sessions', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([mockBook]));
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('book-count')).toHaveTextContent('1');
    expect(localStorage.getItem).toHaveBeenCalledWith('books');
  });

  it('provides initial empty books state', () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    expect(screen.getByTestId('book-count')).toHaveTextContent('0');
  });

  it('loads books from localStorage', () => {
    const testBooks = [
      { id: '1', title: 'Book 1', author: 'Author 1', status: 'dimiliki' }
    ];
    localStorage.setItem('books', JSON.stringify(testBooks));

    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    expect(screen.getByTestId('book-count')).toHaveTextContent('1');
  });

  it('adds a new book', async () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    await act(async () => {
      screen.getByText('Add Book').click();
    });

    expect(screen.getByTestId('book-count')).toHaveTextContent('1');
    expect(JSON.parse(localStorage.getItem('books'))).toHaveLength(1);
  });

  it('updates a book', async () => {
    const testBooks = [
      { id: '1', title: 'Book 1', author: 'Author 1', status: 'dimiliki' }
    ];
    localStorage.setItem('books', JSON.stringify(testBooks));

    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    await act(async () => {
      screen.getByText('Update Book').click();
    });

    const updatedBooks = JSON.parse(localStorage.getItem('books'));
    expect(updatedBooks[0].title).toBe('Updated Book');
  });

  it('deletes a book', async () => {
    const testBooks = [
      { id: '1', title: 'Book 1', author: 'Author 1', status: 'dimiliki' }
    ];
    localStorage.setItem('books', JSON.stringify(testBooks));

    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    await act(async () => {
      screen.getByText('Delete Book').click();
    });

    expect(screen.getByTestId('book-count')).toHaveTextContent('0');
    expect(JSON.parse(localStorage.getItem('books'))).toHaveLength(0);
  });

  it('handles localStorage errors gracefully', () => {
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    Storage.prototype.getItem = vi.fn(() => { throw new Error('Storage error'); });

    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    expect(screen.getByTestId('book-count')).toHaveTextContent('0');
    expect(mockConsoleError).toHaveBeenCalled();

    mockConsoleError.mockRestore();
  });
});