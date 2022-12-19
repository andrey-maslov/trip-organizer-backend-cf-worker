import type {
  CurrencyISOName,
  SectionType,
  Status,
} from '../models/models';

export const transportTypesList = [
  'bus',
  'aircraft',
  'train',
  'car',
  'unknown',
] as const;

export const statusTypesList = [
  'to_find',
  'to_buy',
  'reserved',
  'bought',
  'in_progress',
  'passed',
] as const;

export const sectionTypesList = ['road', 'stay'] as const;
export const placementTypeList = ['hotel', 'flat'] as const;
export const DEFAULT_SECTION_STATUS: Status = 'to_find';

export const DEFAULT_SECTION_TYPE: SectionType = 'road';

export const currencyISONameList = ['EUR', 'USD', 'PLN', 'BYN'] as const;
export const DEFAULT_CURRENCY: CurrencyISOName = 'EUR';

export const currencies: Record<CurrencyISOName, { name: string, symbol: string }> = {
  EUR: {
    name: 'Euro',
    symbol: '€',
  },
  USD: {
    name: 'Dollar USA',
    symbol: '$',
  },
  PLN: {
    name: 'Polish Zloty',
    symbol: 'zł',
  },
  BYN: {
    name: 'Belarusian rouble',
    symbol: 'Br',
  },
};
