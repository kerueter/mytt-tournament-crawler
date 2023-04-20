import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

import { ITournament } from "../interfaces/tournament.interface";

export abstract class BaseTournamentProvider {
  private static readonly CORS_ANYWHERE_PROXY_URL = 'https://europe-west3-mytt-tournament-crawler.cloudfunctions.net/cors-anywhere';
  private static readonly BASE_ROUTE = '/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/tournamentCalendar';

  /**
   * Constructor of the base provider.
   *
   * @param baseUrl
   * @param federation
   */
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly baseUrl: string,
    protected readonly federation: string
  ) { }

  /**
   *
   * @param federation
   * @param circuit
   * @param areas
   */
  public async parseTournaments(
    circuit?: string,
    areas?: string[]
  ): Promise<ITournament[]> {
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Build promises to request the whole year starting from the current month.
    const tournamentPromises: Array<() => Promise<string>> = [];
    for (let requestMonth = currentMonth; requestMonth < 13; requestMonth++) {
      const requestDate = `${currentYear}-${requestMonth < 10 ? ('0' + requestMonth) : requestMonth}-01`;

      const requestParams: Record<string, any> = {
        federation: this.federation,
        date: requestDate,
        circuit
      };

      tournamentPromises.push(
        () => lastValueFrom(
          this.httpClient.get(`${BaseTournamentProvider.CORS_ANYWHERE_PROXY_URL}/${this.baseUrl}${BaseTournamentProvider.BASE_ROUTE}`, {
            params: requestParams,
            responseType: 'text'
          })
        )
      );
    }

    const tournamentResponses = await Promise.all(tournamentPromises.map(promise => promise()));

    let tournaments: ITournament[] = [];

    for (const tournamentResponse of tournamentResponses) {
      const domParser = new DOMParser();

      const htmlContent = domParser.parseFromString(tournamentResponse, 'text/html');

      const resultSet = htmlContent.querySelector('.result-set');

      const resultRows = resultSet?.getElementsByTagName('tr');

      if (!resultRows) {
        console.error('No result rows found');
        return [];
      }

      // We skip the first row since this is the header row.
      for (let i = 1; i < resultRows.length; i++) {
        const resultCols = resultRows[i]?.getElementsByTagName('td');

        if (!resultCols || resultCols.length < 5) {
          continue;
        }

        const area = resultCols[4].innerText.trim();

        if (areas && !areas.includes(area)) {
          continue;
        }

        const registrationLink = `${this.baseUrl}${resultCols[1].getElementsByTagName('a')?.[0]?.getAttribute('href')}`;
        const [_, organizer] = resultCols[1].innerHTML.split('<br>');

        tournaments.push({
          date: this.parseDate(resultCols[0].innerText.trim()),
          freeSpots: resultCols[2].innerText.trim(),
          waitingList: resultCols[3].innerText.trim(),
          area,
          organizer: organizer.trim(),
          registrationLink
        });
      }
    }

    tournaments = tournaments.filter(tournament => tournament.date.getTime() >= now.getTime());

    return tournaments;
  }

  protected abstract parseDate(dateString: string): Date;

  /**
   * Parse a date string to a date object.
   *
   * @param datePart Example: 06.02.2023
   * @param timePart Example: 19:30
   */
  protected processDateParts(datePart: string, timePart?: string): Date {
    const [date, month, year] = datePart.split('.');

    let hour = 0;
    let minute = 0;

    if (timePart && timePart.length) {
      const [hourExtracted, minuteExtracted] = timePart.split(':');

      hour = Number(hourExtracted);
      minute = Number(minuteExtracted);
    }

    return new Date(Number(year), Number(month) - 1, Number(date), hour, minute, 0, 0);
  }
}
