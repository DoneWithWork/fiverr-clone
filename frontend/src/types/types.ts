export type User = {
  _id: string;
  username: string;
  email: string;
  country: string;
  imageUrl: string;
  phone?: string;
  desc?: string;
  isSeller: boolean;
};
