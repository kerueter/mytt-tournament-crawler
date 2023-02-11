import { BaseProvider } from './base.provider';
import { ITournament } from '../interfaces/tournament.interface';

export class WTTVProvider extends BaseProvider {
  private static readonly BASE_URL = 'https://wttv.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/tournamentCalendar';
  private static readonly FEDERATION = 'WTTV';

  /**
   * Constructor of the WTTV provider.
   */
  constructor() {
    super(WTTVProvider.BASE_URL, WTTVProvider.FEDERATION);
  }

  /**
   *
   * @param circuit
   * @param date
   * @param areas
   */
  public async parseTournaments(
    circuit = '2023_Turnierserie',
    date?: string,
    areas = ['Bielefeld/Halle']
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