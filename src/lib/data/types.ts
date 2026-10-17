export type Role = "owner" | "client";

/** How a client got access. */
export type Source = "booking" | "granted";

export type Account = {
  id: string;
  name: string;
  email: string;
  role: Role;
  source: Source;
  createdAt: number;
};

export type Booking = {
  id: string;
  accountId: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: "new" | "in-progress" | "complete";
  createdAt: number;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
};

export type Message = {
  id: string;
  threadId: string; // client account id
  from: Role;
  text: string;
  createdAt: number;
};

export type Thread = {
  client: Account;
  lastMessage?: Message;
  unread: number;
};
