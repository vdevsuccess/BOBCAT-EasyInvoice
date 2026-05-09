export type LineType = "UN" | "PA" | "TR" | "MC";

export interface LineItem {
  idx: number;
  type: LineType;
  item: string;
  desc: string;
  year: string;
  condition: string;
  serialized: "Y" | "N" | "";
  sn: string;
  meter: string;
  qty: string;
  tax: "Y" | "N";
  price: string;
  taxAmt: string;
  discount: string;
  net: number;
}

export interface MiscFee {
  idx: number;
  label: string;
  amount: string;
}

export interface PayRow {
  idx: number;
  type: string;
  desc: string;
  amount: string;
}

export interface DealerInfo {
  name: string;
  code: string;
  phone: string;
  fax: string;
  email: string;
  web: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  invNum: string;
  invDate: string;
  po: string;
  sales: string;
}

export interface BuyerInfo {
  name: string;
  custid: string;
  email: string;
  phone: string;
  contact: string;
  billStreet: string;
  billCity: string;
  billState: string;
  billZip: string;
  shipStreet: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  sameAddress: boolean;
  shipVia: string;
}

export interface InvoiceState {
  dealer: DealerInfo;
  buyer: BuyerInfo;
  lines: LineItem[];
  miscFees: MiscFee[];
  pays: PayRow[];
  scheduleTotal: string;
}
