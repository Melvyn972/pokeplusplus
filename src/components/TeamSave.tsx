import type { SavedTeam } from "../types";

interface TeamSaveProps {
  savedTeams: SavedTeam[];
  onLoad: (team: SavedTeam) => void;
  onDelete: (id: string) => void;
}

export function TeamSave({ savedTeams, onLoad, onDelete }: TeamSaveProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <h2 className="font-bold text-gray-800 text-lg mb-3">Équipes sauvegardées</h2>

      {savedTeams.length === 0 ? (
        <p className="text-xs text-gray-400">Aucune équipe sauvegardée</p>
      ) : (
        <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {savedTeams.map((savedTeam) => (
            <li
              key={savedTeam.id}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50
                hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <button
                type="button"
                onClick={() => onLoad(savedTeam)}
                className="flex-1 text-left p-3 cursor-pointer"
              >
                <span className="block text-sm font-medium text-gray-700 capitalize">
                  {savedTeam.name}
                </span>
                <span className="block text-xs text-gray-400 mt-0.5">
                  {savedTeam.pokemons.length} Pokémon
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(savedTeam.id)}
                aria-label="Supprimer"
                className="shrink-0 pr-3 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
