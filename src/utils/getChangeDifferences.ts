import { Ticket } from './model';

interface ChangeDifferences {
  hasNewComments: boolean;
}

export function getChangeDifferences(
  ticket1: Ticket,
  ticket2: Ticket
): ChangeDifferences {
  const commentsOnTicket1 = ticket1.changes.filter(
    (change) => change.comment
  ).length;
  const commentsOnTicket2 = ticket2.changes.filter(
    (change) => change.comment
  ).length;

  return {
    hasNewComments: commentsOnTicket1 !== commentsOnTicket2,
  };
}
