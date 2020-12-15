import { Address } from './address';

export interface Restaurant {
  id?: string;
  name: string;
  category: string;
  description: string;
  address: Address;
}
