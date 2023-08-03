import { getChangeInTickets } from './getChangeInTickets';
import { Ticket } from './model';

describe('getChangeInTickets.test', () => {
  test('should return NewTicketResult when ticket is added', async () => {
    // Arrange
    const ticket1: Ticket = {
      repository: 'any-repo-1',
      number: 1,
      changes: [],
      title: 'any-title',
      url: 'any-url',
    };

    // Act
    const result = getChangeInTickets([], [ticket1]);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.type).toEqual('NEW_TICKET');
  });
});
