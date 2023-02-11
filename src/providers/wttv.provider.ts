import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';

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
}