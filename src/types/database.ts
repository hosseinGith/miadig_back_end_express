export interface Otp_codes {
  gmail: string;
  otp_code: string;
  time: string;
  id: number;
  temporaryKey: string;
}

export const ProductKeys = [
  "id",
  "company_id",
  "imageURL",
  "category",
  "price",
  "old_price",
  "price_currency",
] as const;

export type ProductKeys_arr = (typeof ProductKeys)[number];

export type Product = {
  [key in ProductKeys_arr]: string | number;
};
