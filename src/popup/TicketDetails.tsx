import { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Notification,
  NotificationService,
  notificationRepository,
} from '../services/NotificationService';
import { Ticket } from '../services/TicketService';

const notificationService = new NotificationService(notificationRepository);

type Props = {
  ticket: Ticket;
  onTicketRemove: (repository: string, number: number) => void;
};

async function getNotificationForTicket(
  ticket: Ticket
): Promise<Notification[]> {
  return notificationService.getNotifications(ticket.repository, ticket.number);
}

export default function TicketDetails(props: Props): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotificationForTicket(props.ticket).then((notifications) => {
      setNotifications(notifications);
    });
  }, []);

  function removeTicket(repository: string, number: number) {
    return () => props.onTicketRemove(repository, number);
  }

  async function onDetailsToggle() {
    for (const notification of notifications) {
      await notificationService.setRead(notification.id);
    }

    getNotificationForTicket(props.ticket).then((notifications) => {
      setNotifications(notifications);
    });
  }

  const hasUnreadNotification = notifications.some(
    (notification) => !notification.read
  );

  return (
    <details onToggle={onDetailsToggle}>
      <summary>
        <a href={props.ticket.ticketUrl} target='_blank'>
          {hasUnreadNotification && <span>*</span>} {props.ticket.repository}/
          {props.ticket.number}: {props.ticket.title}
        </a>
        <button
          onClick={removeTicket(props.ticket.repository, props.ticket.number)}
        >
          ✕
        </button>
      </summary>
      <ul>
        {notifications.map((notification) => {
          return <li key={notification.id}>{notification.message}</li>;
        })}
      </ul>
    </details>
  );
}
