import { Ticket } from './model';
import { getChangeDifferences } from './getChangeDifferences';

describe('getChangeDifferences', () => {
  test('should return with hasNewComments set to true', async () => {
    // Arrange
    const originalTicket: Ticket = {
      repository: 'any-repo',
      number: 1,
      changes: [],
      title: 'any-title',
    };

    const updatedTicket: Ticket = {
      repository: 'any-repo',
      number: 1,
      changes: [
        {
          comment: {
            id: 'any-id',
            text: 'any-text',
          },
        },
      ],
      title: 'any-title',
    };

    // Act
    const result = await getChangeDifferences(updatedTicket, originalTicket);

    // Assert
    expect(result.hasNewComments).toEqual(true);
  });
});
