import type { CountryMasterData } from '../types';
import { COUNTRIES_DATA } from '../data/countriesData';

export class CountryService {
  public static getAllCountries(): CountryMasterData[] {
    return Object.values(COUNTRIES_DATA);
  }

  public static getCountry(code: string): CountryMasterData {
    return COUNTRIES_DATA[code] || COUNTRIES_DATA['SG'];
  }

  public static getSupportedCodes(): string[] {
    return Object.keys(COUNTRIES_DATA);
  }

  public static getComparisonData(codes: string[] = ['SG', 'AE', 'DE']): CountryMasterData[] {
    return codes.map((c) => this.getCountry(c));
  }
}
