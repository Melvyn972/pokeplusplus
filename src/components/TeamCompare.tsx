import { useState } from "react";
import type { SavedTeam } from "../types";
import {
  TeamComparisonFacade,
  type TeamComparisonReport,
} from "../facade/TeamComparisonFacade";
import { teamEvents } from "../observer/teamEvents";

interface TeamCompareProps {
  savedTeams: SavedTeam[];
}

const comparisonFacade = new TeamComparisonFacade();

export function TeamCompare({ savedTeams }: TeamCompareProps) {
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [report, setReport] = useState<TeamComparisonReport | null>(null);

  function handleCompare() {
    const teamA = savedTeams.find((team) => team.id === teamAId);
    const teamB = savedTeams.find((team) => team.id === teamBId);

    if (!teamA || !teamB) {
      return;
    }

    if (teamA.id === teamB.id) {
      teamEvents.emit<string>(
        "team:compare-error",
        "Choisissez deux équipes différentes pour comparer."
      );
      return;
    }

    const result = comparisonFacade.compare(teamA, teamB);
    setReport(result);

    const winnerMessage =
      result.winner === "tie"
        ? `Comparaison ${teamA.name} / ${teamB.name} : égalité.`
        : `Comparaison : « ${
            result.winner === "A" ? result.teamAName : result.teamBName
          } » a la plus forte puissance totale.`;

    teamEvents.emit<string>("team:compared", winnerMessage);
  }

  if (savedTeams.length < 2) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-800 text-lg mb-2">Comparer des équipes</h2>
        <p className="text-xs text-gray-400">
          Sauvegardez au moins deux équipes pour activer la comparaison.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <h2 className="font-bold text-gray-800 text-lg mb-3">Comparer des équipes</h2>

      <div className="flex flex-col gap-2 mb-3">
        <label className="text-xs font-medium text-gray-500">
          Équipe A
          <select
            value={teamAId}
            onChange={(event) => setTeamAId(event.target.value)}
            className="mt-1 w-full text-sm py-2 px-3 rounded-lg border border-gray-200
              focus:outline-none focus:border-red-300"
          >
            <option value="">Choisir…</option>
            {savedTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-gray-500">
          Équipe B
          <select
            value={teamBId}
            onChange={(event) => setTeamBId(event.target.value)}
            className="mt-1 w-full text-sm py-2 px-3 rounded-lg border border-gray-200
              focus:outline-none focus:border-red-300"
          >
            <option value="">Choisir…</option>
            {savedTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleCompare}
        disabled={!teamAId || !teamBId}
        className="w-full text-sm py-2 rounded-lg font-medium transition-colors
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
          bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
      >
        Comparer
      </button>

      {report && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-2">
          <p className="font-medium text-gray-800">Résultat</p>
          <p className="text-gray-600">
            <span className="capitalize">{report.teamAName}</span> : puissance{" "}
            {report.totalPowerA} · {report.typeCountA} types · HP moy. {report.avgHpA}
          </p>
          <p className="text-gray-600">
            <span className="capitalize">{report.teamBName}</span> : puissance{" "}
            {report.totalPowerB} · {report.typeCountB} types · HP moy. {report.avgHpB}
          </p>
          <p className="text-gray-700 font-medium">
            {report.winner === "tie"
              ? "Égalité sur la puissance totale."
              : `Gagnant : équipe ${report.winner} (${report.winner === "A" ? report.teamAName : report.teamBName}).`}
          </p>
          {report.sharedPokemonNames.length > 0 ? (
            <p className="text-xs text-gray-500">
              En commun : {report.sharedPokemonNames.join(", ")}
            </p>
          ) : (
            <p className="text-xs text-gray-400">Aucun Pokémon en commun.</p>
          )}
        </div>
      )}
    </div>
  );
}
