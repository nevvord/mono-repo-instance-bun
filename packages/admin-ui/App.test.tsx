import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import App from './src/App';

describe('Admin App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('displays dashboard title', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to Admin Panel/i)).toBeInTheDocument();
  });

  it('renders stats cards', () => {
    render(<App />);
    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/System Load/i)).toBeInTheDocument();
    expect(screen.getByText(/Error Rate/i)).toBeInTheDocument();
  });

  it('renders tab navigation', () => {
    render(<App />);
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
    expect(screen.getByText(/System/i)).toBeInTheDocument();
    expect(screen.getByText(/Logs/i)).toBeInTheDocument();
  });
});
