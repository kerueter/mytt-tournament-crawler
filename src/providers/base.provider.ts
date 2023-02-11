import { ITournament } from "../interfaces/tournament.interface";

export abstract class BaseProvider {
  /**
   *
   * @param circuit
   * @param date
   * @param areas
   */
  public abstract parseTournaments(circuit: string, date: string, areas: string[]): Promise<ITournament[]>;

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