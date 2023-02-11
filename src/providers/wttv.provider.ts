import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';

import { BaseProvider } from './base.provider';
import { ITournament } from '../interfaces/tournament.interface';

export class WTTVProvider extends BaseProvider {
  private static readonly BASE_URL = 'https://wttv.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/tournamentCalendar';

  constructor() {
    super();
  }

  /**
   *
   * @param circuit
   * @param date
   * @param areas
   */
  public async parseTournaments(
    circuit = '2023_Turnierserie',
    date = 'date=2023-01-01',
    areas = ['Bielefeld/Halle']
  ): Promise<ITournament[]> {
    const response = await axios.get(WTTVProvider.BASE_URL, {
      params: { federation: 'WTTV', circuit, date }
    });

    const parsedData = parseHTML(response.data);

    const resultSet = parsedData.querySelector('.result-set');

    const resultRows = resultSet?.getElementsByTagName('tr');

    if (!resultRows) {
      console.error('No result rows found');
      return [];
    }

    const tournaments: ITournament[] = [];

    // We skip the first row since this is the header row.
    for (let i = 1; i < resultRows.length; i++) {
      const resultCols = resultRows[i]?.getElementsByTagName('td');

      if (!resultCols || resultCols.length < 5) {
        continue;
      }

      const area = resultCols[4].innerText.trim();

      if (!areas.includes(area)) {
        continue;
      }

      tournaments.push({
        date: this.parseDate(resultCols[0].innerText.trim()),
        participants: resultCols[2].innerText.trim(),
        area
      });
    }

    return tournaments;
  }
}