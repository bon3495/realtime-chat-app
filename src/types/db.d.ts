export interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

export interface IChat {
  id: string;
  message: IMessage[];
}

export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
