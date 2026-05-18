import type { PokemonType } from "../types";

const TYPES: PokemonType[] = [
  "fire", "water", "grass", "electric", "psychic", "ice",
  "dragon", "dark", "fairy", "normal", "fighting", "flying",
  "poison", "ground", "rock", "bug", "ghost", "steel",
];

type SortCriterion = "none" | "name" | "hp" | "attack" | "speed";

interface FilterBarProps {
  selectedType: PokemonType | "all";
  onTypeChange: (type: PokemonType | "all") => void;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortCriterion;
  onSortChange: (criterion: SortCriterion) => void;
}

export function FilterBar({ selectedType, onTypeChange, search, onSearchChange, sortBy, onSortChange }: FilterBarProps) {
  return (
    <div className="flex gap-3 items-center flex-wrap mb-6">
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 w-52"
      />
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value as PokemonType | "all")}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 capitalize"
      >
        <option value="all">Tous les types</option>
        {TYPES.map((t) => (
          <option key={t} value={t} className="capitalize">
            {t}
          </option>
        ))}
      </select>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortCriterion)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        <option value="none">Trier par...</option>
        <option value="name">Nom</option>
        <option value="hp">HP</option>
        <option value="attack">Attaque</option>
        <option value="speed">Vitesse</option>
      </select>
    </div>
  );
}
