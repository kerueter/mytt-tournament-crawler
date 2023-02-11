import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';

import { ITournament } from "../interfaces/tournament.interface";

export abstract class BaseProvider {
  private static readonly BASE_ROUTE = '/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/tournamentCalendar';

  protected baseUrl: string;
  protected federation: string;

  /**
   * Constructor of the base provider.
   *
   * @param baseUrl
   * @param federation
   */
  constructor(baseUrl: string, federation: string) {
    this.baseUrl = baseUrl;
    this.federation = federation;
  }

  /**
   *
   * @param federation
   * @param circuit
   * @param date
   * @param areas
   */
  public async parseTournaments(
    circuit?: string,
    date?: string,
    areas?: string[]
  ): Promise<ITournament[]> {
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const requestDate = date || `${currentYear}-${currentMonth}-01`;

    const requestParams: Record<string, any> = {
      federation: this.federation,
      date: requestDate,
      circuit
    };

    const response = await axios.get(`${this.baseUrl}${BaseProvider.BASE_ROUTE}`, {
      params: requestParams
    });

    const parsedData = parseHTML(response.data);

    const resultSet = parsedData.querySelector('.result-set');

    const resultRows = resultSet?.getElementsByTagName('tr');

    if (!resultRows) {
      console.error('No result rows found');
      return [];
    }

    let tournaments: ITournament[] = [];

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

      // console.log(resultCols[1].toString());

      tournaments.push({
        date: this.parseDate(resultCols[0].innerText.trim()),
        freeSpots: resultCols[2].innerText.trim(),
        waitingList: resultCols[3].innerText.trim(),
        area,
        organizer: organizer.trim(),
        registrationLink
      });
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