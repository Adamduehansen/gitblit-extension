import { JSX, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Ticket,
  TicketRepository,
  TicketService,
} from '../services/TicketService';
import TicketDetails from './TicketDetails';

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

  async function removeTicket(
    repository: string,
    number: number
  ): Promise<void> {
    await ticketService.removeTicket(repository, number);
    const updatedTickets = await ticketService.getTickets();
    setTickets(updatedTickets);
  }

  return (
    <>
      <header>
        <h1>Gitblit Extension</h1>
      </header>
      <main>
        <section>
          <h2>Tickets</h2>
          {tickets.map((ticket): JSX.Element => {
            return (
              <TicketDetails ticket={ticket} onTicketRemove={removeTicket} />
            );
          })}
        </section>
        <button onClick={onOpenAllClicked}>Create tab group</button>
      </main>
    </>
  );
}

render(<Popup />, document.getElementById('root')!);
