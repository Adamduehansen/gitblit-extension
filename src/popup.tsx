import { JSX, render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  Ticket,
  TicketRepository,
  TicketService,
} from './services/TicketService';
import {
  Notification,
  NotificationService,
  notificationRepository,
} from './services/NotificationService';

const ticketService = new TicketService(TicketRepository);
const notificationService = new NotificationService(notificationRepository);

function Popup(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    ticketService.getTickets().then((tickets) => {
      setTickets(tickets);
    });

    notificationService.getNotifications().then((notifications) => {
      setNotifications(notifications);
    });
  }, []);

  async function onOpenAllClicked(): Promise<void> {
    const tickets = await ticketService.getTickets();

    let tabIds: number[] = [];
    for (const ticket of tickets) {
      const tab = await chrome.tabs.create({
        url: ticket.jsonUrl,
        active: false,
      });

      if (tab.id === undefined) {
        return;
      }

      tabIds.push(tab.id);
    }

    const tabGroup = await chrome.tabs.group({
      tabIds: tabIds,
    });

    await chrome.tabGroups.update(tabGroup, {
      title: 'Gitblit Extension Group',
      collapsed: true,
    });
  }

  function removeTicket(
    repository: string,
    number: number
  ): () => Promise<void> {
    return async function () {
      await ticketService.removeTicket(repository, number);
      const updatedTickets = await ticketService.getTickets();
      setTickets(updatedTickets);
    };
  }

  return (
    <>
      <header>
        <h1>Gitblit Extension</h1>
      </header>
      <main>
        <section>
          <h2>Tickets</h2>
          {tickets.map((ticket) => {
            const notificationsForTicket = notifications.filter(
              (notification) =>
                notification.ticketRepository === ticket.repository &&
                notification.ticketNumber === ticket.number
            );
            const hasUnreadNotification = notificationsForTicket.some(
              (notification) => !notification.read
            );

            return (
              <details
                onToggle={() => {
                  notificationsForTicket.forEach((notification) => {
                    notificationService.setRead(notification.id);
                  });
                }}
                ref={detailsRef}
              >
                <summary>
                  <a href={ticket.ticketUrl} target='_blank'>
                    {hasUnreadNotification && <span>*</span>}{' '}
                    {ticket.repository}/{ticket.number}: {ticket.title}
                  </a>
                  <button
                    onClick={removeTicket(ticket.repository, ticket.number)}
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
          })}
        </section>
        <button onClick={onOpenAllClicked}>Create tab group</button>
      </main>
    </>
  );
}

render(<Popup />, document.getElementById('root')!);
