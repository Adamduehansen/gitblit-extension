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

export default function TicketDetails(props: Props): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    notificationService.getNotifications().then((notifications) => {
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
    notificationService.getNotifications().then((notifications) => {
      setNotifications(notifications);
    });
  }

  const notificationsForTicket = notifications.filter(
    (notification) =>
      notification.ticketRepository === props.ticket.repository &&
      notification.ticketNumber === props.ticket.number
  );
  const hasUnreadNotification = notificationsForTicket.some(
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
        {notificationsForTicket.map((notification) => {
          return <li>{notification.message}</li>;
        })}
      </ul>
    </details>
  );
}
