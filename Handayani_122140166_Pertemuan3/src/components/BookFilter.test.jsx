import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookFilter from './BookFilter';
import { renderWithProvider } from '../test/setup';

describe('BookFilter', () => {
  let mockFilterChange;
  let mockSearchChange;

  beforeEach(() => {
    mockFilterChange = vi.fn();
    mockSearchChange = vi.fn();
  });

  it('renders filter and search inputs', () => {
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    expect(screen.getByLabelText(/filter status/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/cari judul atau penulis/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when status filter changes', () => {
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    const filterSelect = screen.getByLabelText(/status/i);
    fireEvent.change(filterSelect, { target: { value: 'dibaca' } });

    expect(mockFilterChange).toHaveBeenCalledWith('dibaca');
  });

  it('calls onSearchChange when search input changes', () => {
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari buku/i);
    fireEvent.change(searchInput, { target: { value: 'test book' } });

    expect(mockSearchChange).toHaveBeenCalledWith('test book');
  });

  it('debounces search input changes', async () => {
    vi.useFakeTimers();
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari buku/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: 'test book' } });

    vi.runAllTimers();

    await waitFor(() => {
      expect(mockSearchChange).toHaveBeenCalledTimes(1);
      expect(mockSearchChange).toHaveBeenLastCalledWith('test book');
    });

    vi.useRealTimers();
  });

  it('resets filter when reset button is clicked', () => {
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    const filterSelect = screen.getByLabelText(/filter status/i);
    const searchInput = screen.getByPlaceholderText(/cari judul atau penulis/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });

    fireEvent.change(filterSelect, { target: { value: 'dibaca' } });
    fireEvent.change(searchInput, { target: { value: 'test book' } });
    fireEvent.click(resetButton);

    expect(filterSelect).toHaveValue('semua');
    expect(searchInput).toHaveValue('');
    expect(mockFilterChange).toHaveBeenLastCalledWith('');
    expect(mockSearchChange).toHaveBeenLastCalledWith('');
  });

  it('maintains filter state between renders', () => {
    const { rerender } = render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
        initialFilter="dibaca"
        initialSearch="test"
      />
    );

    expect(screen.getByLabelText(/status/i)).toHaveValue('dibaca');
    expect(screen.getByPlaceholderText(/cari buku/i)).toHaveValue('test');

    rerender(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
        initialFilter="dibaca"
        initialSearch="test"
      />
    );

    expect(screen.getByLabelText(/status/i)).toHaveValue('dibaca');
    expect(screen.getByPlaceholderText(/cari buku/i)).toHaveValue('test');
  });
  });

  it('debounces search input', async () => {
    vi.useFakeTimers();
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari buku/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockSearchChange).not.toHaveBeenCalled();

    await vi.advanceTimersByTime(300);
    expect(mockSearchChange).toHaveBeenCalledWith('test');

    vi.useRealTimers();
  });

  it('has all required filter options', () => {
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    const filterSelect = screen.getByLabelText(/status/i);
    const options = Array.from(filterSelect.options).map(option => option.value);

    expect(options).toContain('semua');
    expect(options).toContain('dimiliki');
    expect(options).toContain('dibaca');
    expect(options).toContain('ingin_beli');
  });