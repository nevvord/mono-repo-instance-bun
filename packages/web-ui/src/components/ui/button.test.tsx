import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDefined();
  });

  it('renders with outline variant', () => {
    render(<Button variant='outline'>Outline Button</Button>);
    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toBeDefined();
  });

  it('renders with ghost variant', () => {
    render(<Button variant='ghost'>Ghost Button</Button>);
    const button = screen.getByRole('button', { name: /ghost button/i });
    expect(button).toBeDefined();
  });

  it('renders with destructive variant', () => {
    render(<Button variant='destructive'>Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toBeDefined();
  });

  it('handles click events', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };
    render(<Button onClick={handleClick}>Test Button</Button>);

    const button = screen.getByRole('button', { name: /test button/i });
    button.click();

    expect(clicked).toBe(true);
  });
});
