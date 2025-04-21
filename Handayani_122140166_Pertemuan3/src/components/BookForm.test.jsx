import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookForm from './BookForm';
import { renderWithProvider } from '../test/setup';

describe('BookForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  it('renders empty form correctly', () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/judul buku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/penulis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tambah buku/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);
    
    fireEvent.blur(titleInput);
    fireEvent.blur(authorInput);
    
    const submitButton = screen.getByRole('button', { name: /tambah buku/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Judul buku wajib diisi')).toBeInTheDocument();
    expect(await screen.findByText('Nama penulis wajib diisi')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates title length', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/judul buku/i);
    fireEvent.change(titleInput, { target: { value: 'a' } });
    fireEvent.blur(titleInput);

    expect(await screen.findByText('Judul buku minimal 2 karakter')).toBeInTheDocument();
  });

  it('validates author name format', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const authorInput = screen.getByLabelText(/penulis/i);
    fireEvent.change(authorInput, { target: { value: '123' } });
    fireEvent.blur(authorInput);

    expect(await screen.findByText('Nama penulis hanya boleh mengandung huruf dan spasi')).toBeInTheDocument();
  });

  it('validates author name with only letters and spaces', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const authorInput = screen.getByLabelText(/penulis/i);
    fireEvent.change(authorInput, { target: { value: 'John123' } });
    fireEvent.blur(authorInput);

    expect(await screen.findByText('Nama penulis hanya boleh mengandung huruf dan spasi')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);
    const statusSelect = screen.getByLabelText(/status/i);

    fireEvent.change(titleInput, { target: { value: 'Test Book' } });
    fireEvent.change(authorInput, { target: { value: 'John Doe' } });
    fireEvent.change(statusSelect, { target: { value: 'dibaca' } });

    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Book',
        author: 'John Doe',
        status: 'dibaca'
      });
    });
  });

  it('clears form after successful submission', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);

    fireEvent.change(titleInput, { target: { value: 'Test Book' } });
    fireEvent.change(authorInput, { target: { value: 'John Doe' } });

    const submitButton = screen.getByRole('button', { name: /tambah buku/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(authorInput).toHaveValue('');
    });
  });

  it('handles form cancellation', () => {
    render(<BookForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /batal/i });
    fireEvent.click(cancelButton);

    expect(mockCancel).toHaveBeenCalled();
  });

  it('handles edit mode correctly', () => {
    const bookToEdit = {
      id: '1',
      title: 'Existing Book',
      author: 'Jane Doe',
      status: 'dimiliki'
    };

    render(<BookForm book={bookToEdit} onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    expect(screen.getByLabelText(/judul buku/i)).toHaveValue('Existing Book');
    expect(screen.getByLabelText(/penulis/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/status/i)).toHaveValue('dimiliki');
    expect(screen.getByRole('button', { name: /update buku/i })).toBeInTheDocument();
  });
});