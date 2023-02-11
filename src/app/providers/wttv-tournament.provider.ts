import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ITournament } from '../interfaces/tournament.interface';
import { BaseTournamentProvider } from './base-tournament.provider';

@Injectable({
  providedIn: 'root'
})
export class WTTVTournamentProvider extends BaseTournamentProvider {
  private static readonly BASE_URL = 'https://wttv.click-tt.de';
  private static readonly FEDERATION = 'WTTV';

  constructor(
    protected override readonly httpClient: HttpClient
  ) {
    super(httpClient, WTTVTournamentProvider.BASE_URL, WTTVTournamentProvider.FEDERATION);
  }

  /**
   *
   * @param circuit
   * @param date
   * @param areas
   */
  public override async parseTournaments(
    circuit = '2023_Turnierserie',
    date?: string,
    areas = ['Bielefeld/Halle', 'Wiedenbrück']
  ): Promise<ITournament[]> {
    return super.parseTournaments(circuit, date, areas);
  }

  /**
   * Parse a date string to a date object.
   *
   * @param dateString The date string to parse
   */
  protected parseDate(dateString: string): Date {
    const [_, datePart, timePart, __] = dateString.split(' ');

    return this.processDateParts(datePart, timePart);
  }
}
