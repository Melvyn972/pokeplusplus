import type { DecoratedPokemon } from "../decorator/pokemonDecorators";

interface TeamPanelProps {
  team: DecoratedPokemon[];
  teamName: string;
  onTeamNameChange: (name: string) => void;
  onSave: () => void;
  canSave: boolean;
  onRemove: (id: number) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const MAX_TEAM_SIZE = 6;

export function TeamPanel({
  team,
  teamName,
  onTeamNameChange,
  onSave,
  canSave,
  onRemove,
  onUndo,
  canUndo,
}: TeamPanelProps) {
  const slots = Array.from({ length: MAX_TEAM_SIZE });

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-6">
        <h2 className="font-bold text-gray-800 text-lg mb-1">Mon équipe</h2>
        <p className="text-xs text-gray-400 mb-4">{team.length} / {MAX_TEAM_SIZE} Pokémon</p>

        <div className="flex flex-col gap-2">
          {slots.map((_, i) => {
            const pokemon = team[i];
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-2 border transition-colors ${
                  pokemon ? "border-gray-200 bg-gray-50" : "border-dashed border-gray-200"
                }`}
              >
                {pokemon ? (
                  <>
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="flex-1 capitalize text-sm font-medium text-gray-700">
                      {pokemon.name}
                    </span>
                    <button
                      onClick={() => onRemove(pokemon.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none cursor-pointer"
                      aria-label="Retirer"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-300 px-1">Emplacement {i + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {team.length === MAX_TEAM_SIZE && (
          <p className="text-xs text-red-400 mt-3 text-center font-medium">
            Équipe complète !
          </p>
        )}

        <label className="block mt-4">
          <span className="text-xs font-medium text-gray-500">Nom de l&apos;équipe</span>
          <input
            type="text"
            value={teamName}
            onChange={(event) => onTeamNameChange(event.target.value)}
            className="mt-1 w-full text-sm py-2 px-3 rounded-lg border border-gray-200
              focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-200"
            placeholder="équipe 1"
          />
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className="mt-3 w-full text-sm py-2 rounded-lg font-medium transition-colors
            disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
            bg-red-500 text-white hover:bg-red-600 cursor-pointer"
        >
          Sauvegarder
        </button>

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="mt-2 w-full text-sm py-2 rounded-lg font-medium transition-colors
            disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
            bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
        >
          ↩ Annuler
        </button>
      </div>
    </div>
  );
}
