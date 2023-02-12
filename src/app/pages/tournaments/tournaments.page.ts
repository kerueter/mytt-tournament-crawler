import { Component } from '@angular/core';
import { ITournament } from '../../interfaces/tournament.interface';
import { TTVNTournamentProvider } from '../../providers/ttvn-tournament.provider';
import { WTTVTournamentProvider } from '../../providers/wttv-tournament.provider';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss']
})
export class TournamentsPage {
  public tournaments: ITournament[];

  constructor(
    private readonly wttvTournamentProvider: WTTVTournamentProvider,
    private readonly ttvnTournamentProvider: TTVNTournamentProvider
  ) {
    this.tournaments = [];
  }

  async ngOnInit() {
    try {
      const tournamentsResult = await Promise.all([
        this.wttvTournamentProvider.parseTournaments(),
        this.ttvnTournamentProvider.parseTournaments()
      ]);

      this.tournaments.push(...tournamentsResult.flat());

      this.tournaments.sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error(error);
    }
  }
}
