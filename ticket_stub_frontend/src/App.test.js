import { render, screen } from '@testing-library/react';
import App from './App';

test('renders brand title', () => {
  render(<App />);
  const title = screen.getByText(/Stub Scrapbook/i);
  expect(title).toBeInTheDocument();
});
