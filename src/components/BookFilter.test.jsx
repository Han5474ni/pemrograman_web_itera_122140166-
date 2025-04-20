import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookFilter from './BookFilter';

describe('BookFilter', () => {
  const mockFilterChange = vi.fn();
  const mockSearchChange = vi.fn();

  beforeEach(() => {
    mockFilterChange.mockClear();
    mockSearchChange.mockClear();
  });

  it('renders filter and search inputs', () => {
    render(
      <BookFilter
        onFilterChange={mockFilterChange}
        onSearchChange={mockSearchChange}
      />
    );

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/cari buku/i)).toBeInTheDocument();
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
});