export type User = {
  _id: string;
  username: string;
  email: string;
  country: string;
  imageUrl: string;
  phone?: string;
  desc?: string;
  isSeller: boolean;
  mode: "seller" | "buyer";
};

export type GigType = {
  _id: string;
  title: string;
  desc: string;
  cat: string;
  price: number;
  cover: string;
  images: Array<string>;
  isSeller: boolean;
  revisionNumber: number;
  deliveryTime: number;
  features: Array<string>;
  userId: User;
};
export type OrdersBuyerProps = {
  _id: string;
  buyerId: string;
  sellerId: string;
  isCompleted: boolean;
  payed: boolean;
  paymentIntent: string;
  gigId: GigType;
};
