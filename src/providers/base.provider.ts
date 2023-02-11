import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';

import { ITournament } from "../interfaces/tournament.interface";

export abstract class BaseProvider {
  protected baseUrl: string;
  protected federation: string;

  /**
   * Constructor of the base provider.
   *
   * @param baseUrl
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
    circuit: string,
    date?: string,
    areas?: string[]
  ): Promise<ITournament[]> {
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const requestDate = date || `${currentYear}-${currentMonth}-01`;

    const response = await axios.get(this.baseUrl, {
      params: { federation: this.federation, circuit, date: requestDate }
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

      tournaments.push({
        date: this.parseDate(resultCols[0].innerText.trim()),
        participants: resultCols[2].innerText.trim(),
        area
      });
    }

    tournaments = tournaments.filter(tournament => tournament.date.getTime() >= now.getTime());

    return tournaments;
  }

  /**
   * Parse a date string to a date object.
   *
   * @param dateString Example: Mo. 06.02.2023 19:30 Uhr
   */
  protected parseDate(dateString: string): Date {
    const [_, datePart, timePart, __] = dateString.split(' ');

    const [date, month, year] = datePart.split('.');
    const [hour, minute] = timePart.split(':');

    return new Date(Number(year), Number(month) - 1, Number(date), Number(hour), Number(minute), 0, 0);
  }
}