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
      console.log(`Datum: ${tournament.date.toLocaleString('de-DE', { dateStyle: 'long' })}`);
      console.log(`Teilnehmer: ${tournament.participants}`);
      console.log(`Area: ${tournament.area}\n`);
    }
  } catch (error) {
    console.error(`Unable to parse tournaments: ${(error as any).message}`);
  }
}

run();