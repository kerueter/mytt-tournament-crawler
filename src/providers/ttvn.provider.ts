import { BaseProvider } from './base.provider';
import { ITournament } from '../interfaces/tournament.interface';

export class TTVNProvider extends BaseProvider {
  private static readonly BASE_URL = 'https://wttv.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/tournamentCalendar';
  private static readonly FEDERATION = 'TTVN';

  /**
   * Constructor of the TTVN provider.
   */
  constructor() {
    super(TTVNProvider.BASE_URL, TTVNProvider.FEDERATION);
  }

  /**
   *
   * @param circuit
   * @param date
   * @param areas
   */
  public async parseTournaments(
    circuit = 'TTVN-Race+23',
    date?: string,
    areas = ['Osnabrück-Stadt', 'Osnabrück-Land']
  ): Promise<ITournament[]> {
    return super.parseTournaments(circuit, date, areas);
  }
}