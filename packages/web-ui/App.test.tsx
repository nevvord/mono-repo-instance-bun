import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import App from './src/App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Mono Repo Web UI/i)).toBeInTheDocument();
  });

  it('displays the correct port information', () => {
    render(<App />);
    expect(screen.getAllByText(/Порт: 3000/)).toBeTruthy();
  });

  it('displays the correct environment', () => {
    render(<App />);
    expect(screen.getAllByText(/Окружение: development/)).toBeTruthy();
  });

  it('renders action buttons', () => {
    render(<App />);
    expect(screen.getAllByText(/Primary/)).toBeTruthy();
    expect(screen.getAllByText(/Outline/)).toBeTruthy();
    expect(screen.getAllByText(/Ghost/)).toBeTruthy();
  });
});
