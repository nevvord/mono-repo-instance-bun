import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import App from './src/App';

describe('Admin App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
  });

  it('displays dashboard title', () => {
    render(<App />);
    expect(screen.getAllByText(/Mono Repo Administration/i)).toBeTruthy();
  });

  it('renders stats cards', () => {
    render(<App />);
    expect(screen.getAllByText(/Total Users/i)).toBeTruthy();
    expect(screen.getAllByText(/Active Sessions/i)).toBeTruthy();
    expect(screen.getAllByText(/Database Size/i)).toBeTruthy();
    expect(screen.getAllByText(/System Health/i)).toBeTruthy();
  });

  it('renders tab navigation', () => {
    render(<App />);
    expect(screen.getAllByText(/Overview/i)).toBeTruthy();
    expect(screen.getAllByText(/Users/i)).toBeTruthy();
    expect(screen.getAllByText(/System/i)).toBeTruthy();
    expect(screen.getAllByText(/Logs/i)).toBeTruthy();
  });
});
