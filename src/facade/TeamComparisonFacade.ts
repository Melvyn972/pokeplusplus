import type { SavedTeam } from "../types";

export interface TeamComparisonReport {
  teamAName: string;
  teamBName: string;
  totalPowerA: number;
  totalPowerB: number;
  winner: "A" | "B" | "tie";
  sharedPokemonNames: string[];
  typeCountA: number;
  typeCountB: number;
  avgHpA: number;
  avgHpB: number;
}

export class TeamComparisonFacade {
  compare(teamA: SavedTeam, teamB: SavedTeam): TeamComparisonReport {
    const totalPowerA = this.totalPower(teamA);
    const totalPowerB = this.totalPower(teamB);

    let winner: TeamComparisonReport["winner"] = "tie";
    if (totalPowerA > totalPowerB) winner = "A";
    else if (totalPowerB > totalPowerA) winner = "B";

    const namesA = new Set(teamA.pokemons.map((p) => p.name));
    const sharedPokemonNames = teamB.pokemons
      .filter((p) => namesA.has(p.name))
      .map((p) => p.name);

    return {
      teamAName: teamA.name,
      teamBName: teamB.name,
      totalPowerA,
      totalPowerB,
      winner,
      sharedPokemonNames,
      typeCountA: this.uniqueTypeCount(teamA),
      typeCountB: this.uniqueTypeCount(teamB),
      avgHpA: this.averageHp(teamA),
      avgHpB: this.averageHp(teamB),
    };
  }

  private totalPower(team: SavedTeam): number {
    return team.pokemons.reduce((sum, p) => sum + (p.powerLevel ?? 0), 0);
  }

  private uniqueTypeCount(team: SavedTeam): number {
    return new Set(team.pokemons.flatMap((p) => p.types)).size;
  }

  private averageHp(team: SavedTeam): number {
    if (team.pokemons.length === 0) return 0;
    const total = team.pokemons.reduce((sum, p) => sum + p.stats.hp, 0);
    return Math.round(total / team.pokemons.length);
  }
}
