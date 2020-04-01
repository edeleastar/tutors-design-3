export interface Metric {
  id: string;
  title: string;
  count: number;
  last: string;
  duration: number;
  onlineStatus: string;
  metrics: Metric[];
}

export interface User {
  userId: string;
  email: string;
  picture: string;
  name: string;
  nickname: string;
}

export interface UserMetric {
  userId: string;
  email: string;
  picture: string;
  name: string;
  nickname: string;
  title: string;
  count: number;
  last: string;
  onlineStatus: string;
  duration: number;
  metrics: Metric[];
  labActivity: Metric[];
}

export class SingleUserUpdateEvent {
  user: UserMetric;
  constructor(user) {
    this.user = user;
  }
}

export class LoginEvent {
  user: User;
  constructor(user) {
    this.user = user;
  }
}

export class LogoutEvent {
  user: User;
  constructor(user) {
    this.user = user;
  }
}
