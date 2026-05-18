import type { DecoratedPokemon } from "../decorator/pokemonDecorators";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
  pokemons: DecoratedPokemon[];
  teamIds: number[];
  onAdd: (pokemon: DecoratedPokemon) => void;
}

export function PokemonList({ pokemons, teamIds, onAdd }: PokemonListProps) {
  if (pokemons.length === 0) {
    return (
      <p className="text-gray-400 text-sm mt-8 text-center">Aucun Pokémon trouvé.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {pokemons.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          onAdd={onAdd}
          isInTeam={teamIds.includes(p.id)}
        />
      ))}
    </div>
  );
}
