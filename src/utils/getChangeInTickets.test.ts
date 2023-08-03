import {
  NewCommentResult,
  NewTicketResult,
  getChangeInTickets,
} from './getChangeInTickets';
import { Ticket } from './model';

describe('getChangeInTickets', () => {
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
    const result = getChangeInTickets([], [ticket1]) as NewTicketResult;

    // Assert
    expect(result).not.toBeNull();
    expect(result.type).toEqual('NEW_TICKET');
    expect(result.ticketNumber).toEqual(1);
    expect(result.ticketRepository).toEqual('any-repo-1');
    expect(result.ticketUrl).toEqual('any-url');
  });

  test('should return NewCommentResult if ticket has new comment', () => {
    // Arrange
    const ticketsBeforeComment: Ticket[] = [
      {
        repository: 'any-repo-1',
        number: 1,
        changes: [],
        title: 'any-title',
        url: 'any-url',
      },
      {
        repository: 'any-repo-2',
        number: 1,
        changes: [],
        title: 'any-title',
        url: 'any-url',
      },
    ];

    const ticketsAfterComment: Ticket[] = [
      {
        repository: 'any-repo-1',
        number: 1,
        changes: [
          {
            comment: {
              id: 'any-comment-id-1',
              text: 'any-comment-text',
            },
          },
        ],
        title: 'any-title',
        url: 'any-url',
      },
      {
        repository: 'any-repo-2',
        number: 1,
        changes: [],
        title: 'any-title',
        url: 'any-url',
      },
    ];

    // Act
    const result = getChangeInTickets(
      ticketsBeforeComment,
      ticketsAfterComment
    ) as NewCommentResult;

    // Assert
    expect(result).not.toBeNull();
    expect(result.type).toEqual('NEW_COMMENT');
    expect(result.ticketNumber).toEqual(1);
    expect(result.ticketRepository).toEqual('any-repo-1');
    expect(result.ticketUrl).toEqual('any-url');
    expect(result.commentText).toEqual('any-comment-text');
  });
});
