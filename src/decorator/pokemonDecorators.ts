import type { Pokemon } from "../types";

export interface DecoratedPokemon extends Pokemon {
  powerLevel?: number;
  isLegendary?: boolean;
}

const LEGENDARY_IDS = [144, 145, 146, 150, 151];

export function withPowerLevel(pokemon: Pokemon): DecoratedPokemon {
  const { hp, attack, defense, speed } = pokemon.stats;
  return { ...pokemon, powerLevel: hp + attack + defense + speed };
}

export function withLegendary(pokemon: Pokemon): DecoratedPokemon {
  return { ...pokemon, isLegendary: LEGENDARY_IDS.includes(pokemon.id) };
}
