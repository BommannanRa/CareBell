import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RemindersPage } from './RemindersPage';

describe('RemindersPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows creating a meal reminder', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/reminders?type=FOOD']}>
        <RemindersPage />
      </MemoryRouter>,
    );

    await user.clear(screen.getByLabelText(/Reminder name/i));
    await user.type(screen.getByLabelText(/Reminder name/i), 'Breakfast');
    await user.click(screen.getByRole('button', { name: /Save reminder/i }));

    expect(screen.getByText(/Reminder created:/i)).toBeInTheDocument();
  });
});
