import {
  Ticket,
  TicketRepository,
  TicketService,
} from './services/TicketService';

const button = document.querySelector('button');
button?.addEventListener('click', async () => {
  const ticketService = new TicketService(TicketRepository);
  const { tickets } = (await chrome.storage.local.get('tickets')) as {
    tickets: Ticket[];
  };

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
  });
});
