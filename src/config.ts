const AppConfig = {
  API_URL: "https://pokeapi.co/api/v2",
  POKEMON_LIMIT: 151,
  MAX_TEAM_SIZE: 6,
  SAVED_TEAMS_STORAGE_KEY: "pokemon-saved-teams",
} as const;

export default AppConfig;
