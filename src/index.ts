import { ITournament } from "./interfaces/tournament.interface";
import { WTTVProvider } from "./providers/wttv.provider";
import { TTVNProvider } from "./providers/ttvn.provider";

async function run(): Promise<void> {
  let totalTournaments: ITournament[] = [];

  try {
    totalTournaments.push(...await new WTTVProvider().parseTournaments());
    totalTournaments.push(...await new TTVNProvider().parseTournaments());

    totalTournaments.sort((a, b) => a.date.getTime() - b.date.getTime());

    for (const tournament of totalTournaments) {
      let colorCode = 32;

      const freeSpotsParts = tournament.freeSpots.split('/');
      const freeSpots = Number(freeSpotsParts[0]);
      const totalSpots = Number(freeSpotsParts[1]);

      if (freeSpots === 0) {
        colorCode = 31;
      } else if (totalSpots > 0 && (freeSpots / totalSpots) < 0.25) {
        colorCode = 32;
      }

      console.log(`Datum: ${tournament.date.toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' })}`);
      console.log(`Organisator: ${tournament.organizer}`);
      console.log(`\x1b[${colorCode}m%s\x1b[0m`, `Freie Plätze: ${tournament.freeSpots}`);
      console.log(`Warteliste: ${tournament.waitingList}`);
      console.log(`Area: ${tournament.area}`);

      if (tournament.registrationLink) {
        console.log(`Anmeldelink: ${tournament.registrationLink}`);
      }

      console.log(`\n`);
    }
  } catch (error) {
    console.error(`Unable to parse tournaments: ${(error as any).message}`);
  }
}

run();