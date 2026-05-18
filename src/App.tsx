import { useEffect, useRef, useState } from "react";
import type { PokemonType, SavedTeam } from "./types";
import type { DecoratedPokemon } from "./decorator/pokemonDecorators";
import AppConfig from "./config";
import { PokemonApiAdapter } from "./adapter/PokemonApiAdapter";
import { withPowerLevel, withLegendary } from "./decorator/pokemonDecorators";
import { teamEvents } from "./observer/teamEvents";
import { ByNameStrategy, ByTypeStrategy, BySortStrategy } from "./strategy/filterStrategies";
import { AddPokemonCommand, RemovePokemonCommand, CommandHistory } from "./command/teamCommands";
import { FilterBar } from "./components/FilterBar";
import { PokemonList } from "./components/PokemonList";
import { TeamPanel } from "./components/TeamPanel";
import { TeamSave } from "./components/TeamSave";
import { Notification } from "./components/Notification";
import {
  deleteTeam,
  getSuggestedTeamName,
  loadSavedTeams,
  saveTeam,
} from "./storage/savedTeamsStorage";

function App() {
  const [pokemons, setPokemons] = useState<DecoratedPokemon[]>([]);
  const [team, setTeam] = useState<DecoratedPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<PokemonType | "all">("all");
  const [sortBy, setSortBy] = useState<"none" | "name" | "hp" | "attack" | "speed">("none");
  const [canUndo, setCanUndo] = useState(false);
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
  const [teamName, setTeamName] = useState("équipe 1");
  const teamRef = useRef<DecoratedPokemon[]>([]);
  const history = useRef(new CommandHistory());

  useEffect(() => { teamRef.current = team; }, [team]);

  useEffect(() => {
    setSavedTeams(loadSavedTeams());
  }, []);

  useEffect(() => {
    const adapter = new PokemonApiAdapter();
    setLoading(true);
    adapter.fetchAll().then((data) => {
      setPokemons(data.map((p) => withLegendary(withPowerLevel(p))));
      setLoading(false);
    });
  }, []);

  function handleAdd(pokemon: DecoratedPokemon) {
    if (team.length >= AppConfig.MAX_TEAM_SIZE) {
      teamEvents.emit<string>("team:full", "Équipe complète ! Retirez un Pokémon pour en ajouter un autre.");
      return;
    }
    if (team.find((p) => p.id === pokemon.id)) return;
    const cmd = new AddPokemonCommand(pokemon, () => teamRef.current, setTeam);
    history.current.execute(cmd);
    setCanUndo(history.current.canUndo());
  }

  function handleRemove(id: number) {
    const cmd = new RemovePokemonCommand(id, () => teamRef.current, setTeam);
    history.current.execute(cmd);
    setCanUndo(history.current.canUndo());
  }

  function handleUndo() {
    history.current.undo();
    setCanUndo(history.current.canUndo());
  }

  function handleSaveTeam() {
    if (team.length === 0) {
      return;
    }

    const name = teamName.trim() || getSuggestedTeamName(savedTeams);
    const entry: SavedTeam = {
      id: crypto.randomUUID(),
      name,
      pokemons: [...team],
      savedAt: Date.now(),
    };

    const updated = saveTeam(entry);
    setSavedTeams(updated);
    setTeamName(getSuggestedTeamName(updated));
    teamEvents.emit<string>("team:saved", `Équipe « ${name} » sauvegardée.`);
  }

  function handleLoadSavedTeam(saved: SavedTeam) {
    setTeam([...saved.pokemons]);
    history.current.clear();
    setCanUndo(false);
  }

  function handleDeleteSavedTeam(id: string) {
    const updated = deleteTeam(id);
    setSavedTeams(updated);
  }

  const strategies = [
    new ByNameStrategy(search),
    new ByTypeStrategy(selectedType),
    new BySortStrategy(sortBy),
  ];
  const filtered = strategies.reduce((acc, strategy) => strategy.apply(acc), pokemons);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-500 text-white px-8 py-4 shadow">
        <h1 className="text-2xl font-bold tracking-tight">Pokémon Team Builder</h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <div className="flex-1 min-w-0">
          <FilterBar
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 animate-pulse">Chargement des Pokémon...</p>
            </div>
          ) : (
            <PokemonList
              pokemons={filtered}
              teamIds={team.map((p) => p.id)}
              onAdd={handleAdd}
            />
          )}
        </div>

        <aside className="w-72 shrink-0 flex flex-col gap-4">
          <TeamSave
            savedTeams={savedTeams}
            onLoad={handleLoadSavedTeam}
            onDelete={handleDeleteSavedTeam}
          />
          <TeamPanel
            team={team}
            teamName={teamName}
            onTeamNameChange={setTeamName}
            onSave={handleSaveTeam}
            canSave={team.length > 0}
            onRemove={handleRemove}
            onUndo={handleUndo}
            canUndo={canUndo}
          />
        </aside>
      </main>
      <Notification />
    </div>
  );
}

export default App;
