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
      this.tournaments.push(...await this.wttvTournamentProvider.parseTournaments());
      this.tournaments.push(...await this.ttvnTournamentProvider.parseTournaments());

      this.tournaments.sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error(error);
    }
  }
}
