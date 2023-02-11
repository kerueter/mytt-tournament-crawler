import { WTTVProvider } from "./providers/wttv.provider";

async function run(): Promise<void> {
  try {
    const wttvTournaments = await new WTTVProvider().parseTournaments();

    for (const tournament of wttvTournaments) {
      console.log(`Datum: ${tournament.date.toLocaleString('de-DE')}`);
      console.log(`Teilnehmer: ${tournament.participants}`);
      console.log(`Area: ${tournament.area}`);
    }
  } catch (error) {
    console.error(`Unable to parse tournaments from WTTV: ${(error as any).message}`);
  }
}

run();