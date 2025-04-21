import { render } from '@testing-library/react';
import { BookProvider } from '../context/BookContext';
import React from 'react';

export function renderWithProvider(ui, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => <BookProvider>{children}</BookProvider>,
    ...options,
  });
}