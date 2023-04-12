import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type TUserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: TUserId;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: TUserId;
    };
  }
}
