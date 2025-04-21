import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Configure test environment
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return { ...actual, useEffect: vi.fn() };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

global.localStorage = localStorageMock;

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.clear.mockClear();
  localStorageMock.key.mockClear();
});

// Export test utilities
export { renderWithProvider } from './test-utils';