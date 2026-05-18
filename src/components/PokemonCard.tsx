import type { DecoratedPokemon } from "../decorator/pokemonDecorators";

const TYPE_COLORS: Record<string, string> = {
  fire: "bg-orange-100 text-orange-700",
  water: "bg-blue-100 text-blue-700",
  grass: "bg-green-100 text-green-700",
  electric: "bg-yellow-100 text-yellow-700",
  psychic: "bg-pink-100 text-pink-700",
  ice: "bg-cyan-100 text-cyan-700",
  dragon: "bg-indigo-100 text-indigo-700",
  dark: "bg-gray-800 text-gray-100",
  fairy: "bg-pink-100 text-pink-500",
  normal: "bg-gray-100 text-gray-600",
  fighting: "bg-red-100 text-red-700",
  flying: "bg-sky-100 text-sky-700",
  poison: "bg-purple-100 text-purple-700",
  ground: "bg-yellow-200 text-yellow-800",
  rock: "bg-stone-100 text-stone-700",
  bug: "bg-lime-100 text-lime-700",
  ghost: "bg-violet-100 text-violet-700",
  steel: "bg-slate-100 text-slate-600",
};

interface PokemonCardProps {
  pokemon: DecoratedPokemon;
  onAdd: (pokemon: DecoratedPokemon) => void;
  isInTeam: boolean;
}

export function PokemonCard({ pokemon, onAdd, isInTeam }: PokemonCardProps) {
  return (
    <div className={`bg-white border rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow ${pokemon.isLegendary ? "border-yellow-400 ring-1 ring-yellow-300" : "border-gray-200"}`}>
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="w-24 h-24 object-contain"
      />
      <p className="font-semibold capitalize text-gray-800 flex items-center gap-1">
        #{String(pokemon.id).padStart(3, "0")} {pokemon.name}
        {pokemon.isLegendary && <span title="Légendaire">★</span>}
      </p>
      {pokemon.powerLevel !== undefined && (
        <p className="text-xs text-gray-400">Puissance : {pokemon.powerLevel}</p>
      )}
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLORS[type] ?? "bg-gray-100 text-gray-600"}`}
          >
            {type}
          </span>
        ))}
      </div>
      <button
        onClick={() => onAdd(pokemon)}
        disabled={isInTeam}
        className="mt-1 w-full text-sm py-1.5 rounded-lg font-medium transition-colors
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
          bg-red-500 text-white hover:bg-red-600 cursor-pointer"
      >
        {isInTeam ? "Dans l'équipe" : "Ajouter"}
      </button>
    </div>
  );
}
