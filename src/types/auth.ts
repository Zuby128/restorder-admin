export enum Roles {
  OWNER = "owner",
  COME = "waiter",
}

export interface IUser {
  _id: string;
  name: string;
  surname?: string;
  username?: string;
  phone?: string;
  email?: string;
  role: Roles;
  restaurantNo: string;
  subscriptionId?: string;
  isSubscriptionActive?: boolean;
}

export interface IAuth {
  user: IUser | null;
  token: string;
}
