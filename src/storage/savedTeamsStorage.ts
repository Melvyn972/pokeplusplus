import AppConfig from "../config";
import type { SavedTeam } from "../types";

const TEAM_NAME_PATTERN = /^équipe\s+(\d+)$/i;

export function getSuggestedTeamName(teams: SavedTeam[]): string {
  const numbers = teams
    .map((team) => TEAM_NAME_PATTERN.exec(team.name)?.[1])
    .filter((value): value is string => value !== undefined)
    .map((value) => Number.parseInt(value, 10));

  if (numbers.length === 0) {
    return "équipe 1";
  }

  const nextNumber = Math.max(...numbers) + 1;
  return `équipe ${nextNumber}`;
}

export function loadSavedTeams(): SavedTeam[] {
  try {
    const raw = localStorage.getItem(AppConfig.SAVED_TEAMS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as SavedTeam[];
  } catch {
    return [];
  }
}

export function saveTeam(team: SavedTeam): SavedTeam[] {
  const teams = [...loadSavedTeams(), team];
  localStorage.setItem(AppConfig.SAVED_TEAMS_STORAGE_KEY, JSON.stringify(teams));
  return teams;
}

export function deleteTeam(id: string): SavedTeam[] {
  const teams = loadSavedTeams().filter((team) => team.id !== id);
  localStorage.setItem(AppConfig.SAVED_TEAMS_STORAGE_KEY, JSON.stringify(teams));
  return teams;
}
