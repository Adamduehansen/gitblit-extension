import { createGitblitTab } from './handlers/createGitblitTab';
import { initializeStorage } from './handlers/initializeStorage';
import { TicketRepository, TicketService } from './services/TicketService';
import { Message, Ticket } from './utils/model';

chrome.alarms.create('refresh-tabs', {
  periodInMinutes: 1 / 2,
  delayInMinutes: 1 / 10,
});
// chrome.alarms.onAlarm.addListener(reloadGitblitTabs);

chrome.notifications.onClicked.addListener(createGitblitTab);

chrome.runtime.onInstalled.addListener(initializeStorage);

chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type !== 'NEW_TICKET') {
    return;
  }

  console.log('New ticket', message.ticket);
  const ticketService = new TicketService(TicketRepository);
  const tickets = await ticketService.getTickets();
  await ticketService.setTickets([...tickets, message.ticket]);
  console.log('Ticket created in storage', message.ticket);
});

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type !== 'NEW_COMMENT') {
    return;
  }

  console.log('New comment:', message);
});
