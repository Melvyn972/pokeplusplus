import type { Pokemon } from "../types";
import AppConfig from "../config";
import { PokemonFactory } from "../factory/PokemonFactory";

export class PokemonApiAdapter {
  private baseUrl = AppConfig.API_URL;

  async fetchAll(): Promise<Pokemon[]> {
    const res = await fetch(`${this.baseUrl}/pokemon?limit=${AppConfig.POKEMON_LIMIT}`);
    const data = await res.json();

    const details = await Promise.all(
      data.results.map((entry: { url: string }) =>
        fetch(entry.url).then((r) => r.json())
      )
    );

    return details.map(PokemonFactory.create);
  }
}
