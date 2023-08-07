import { JSX, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Ticket,
  TicketRepository,
  TicketService,
} from './services/TicketService';

const ticketService = new TicketService(TicketRepository);

function Popup(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    ticketService.getTickets().then((tickets) => {
      setTickets(tickets);
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

  return (
    <>
      <header>
        <h1>Gitblit Extension</h1>
      </header>
      <main>
        <ul>
          {tickets.map((ticket) => {
            return (
              <li>
                <a href={ticket.ticketUrl} target='_blank'>
                  <h2>{ticket.title}</h2>
                  <div>
                    {ticket.repository}: {ticket.number}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
        <button onClick={onOpenAllClicked}>Create tab group</button>
      </main>
    </>
  );
}

render(<Popup />, document.getElementById('root')!);
