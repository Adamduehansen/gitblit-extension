import { JSX, render } from 'preact';
import { TicketRepository, TicketService } from './services/TicketService';

function Popup(): JSX.Element {
  async function onOpenAllClicked(): Promise<void> {
    const ticketService = new TicketService(TicketRepository);
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

    chrome.tabGroups.update(tabGroup, {
      title: 'Gitblit Extension Group',
      collapsed: true,
    });
  }

  return (
    <div>
      <button onClick={onOpenAllClicked}>Open all</button>
    </div>
  );
}

render(<Popup />, document.getElementById('root')!);
