export type Ticket = {
  repository: string;
  title: string;
  number: number;
  url: string;
};

export type Change = Pick<Ticket, 'repository' | 'number'> & {
  comment?: {
    id: string;
    text: string;
  };
};
