import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookForm from './BookForm';

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
    
    const submitButton = screen.getByRole('button', { name: /tambah buku/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(await screen.findByText(/nama penulis wajib diisi/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates title length', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/judul buku/i);
    fireEvent.change(titleInput, { target: { value: 'a' } });
    fireEvent.blur(titleInput);

    expect(await screen.findByText(/judul buku minimal 2 karakter/i)).toBeInTheDocument();
  });

  it('validates author name format', async () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const authorInput = screen.getByLabelText(/penulis/i);
    fireEvent.change(authorInput, { target: { value: '123' } });
    fireEvent.blur(authorInput);

    expect(await screen.findByText(/nama penulis hanya boleh mengandung huruf dan spasi/i)).toBeInTheDocument();
  });

  it('submits form with valid data', () => {
    render(<BookForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);
    const statusSelect = screen.getByLabelText(/status/i);

    fireEvent.change(titleInput, { target: { value: 'Test Book' } });
    fireEvent.change(authorInput, { target: { value: 'John Doe' } });
    fireEvent.change(statusSelect, { target: { value: 'dibaca' } });

    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Book',
      author: 'John Doe',
      status: 'dibaca'
    });
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