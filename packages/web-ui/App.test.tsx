import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import App from './src/App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Mono Repository/i)).toBeInTheDocument();
  });

  it('displays the correct port information', () => {
    render(<App />);
    expect(screen.getByText(/Порт: 3000/)).toBeInTheDocument();
  });

  it('displays the correct environment', () => {
    render(<App />);
    expect(screen.getByText(/Окружение: development/)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<App />);
    expect(screen.getByText(/Primary/)).toBeInTheDocument();
    expect(screen.getByText(/Outline/)).toBeInTheDocument();
    expect(screen.getByText(/Ghost/)).toBeInTheDocument();
  });
});
