import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ITournament } from '../interfaces/tournament.interface';
import { BaseTournamentProvider } from './base-tournament.provider';

@Injectable({
  providedIn: 'root'
})
export class TTVNTournamentProvider extends BaseTournamentProvider {
  private static readonly BASE_URL = 'https://ttvn.click-tt.de';
  private static readonly FEDERATION = 'TTVN';

  constructor(
    protected override readonly httpClient: HttpClient
  ) {
    super(httpClient, TTVNTournamentProvider.BASE_URL, TTVNTournamentProvider.FEDERATION);
  }

  /**
   *
   * @param circuit
   * @param areas
   */
  public override async parseTournaments(
    circuit = 'TTVN-Race 23',
    areas = ['Osnabrück-Stadt', 'Osnabrück-Land']
  ): Promise<ITournament[]> {
    return super.parseTournaments(circuit, areas);
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
