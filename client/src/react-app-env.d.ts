/// <reference types="react-scripts" />

interface UserData {
  email: string;
  password: string;
  team: string;
  image: string | undefined;
  id?: string;
}

interface User {
  email: string;
  team: string;
  image: string;
  id: string;
}

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  handleGetUser: (email: string) => Promise<void>;
}

interface Competition {
  id: number;
  name: string;
  type: string;
  logo: string;
  countryName: string;
}

interface League {
  _id: string;
  name: string;
  competition: number;
  admin: string;
  players: Array;
}

interface Fixture {
  fixtureId: number;
  date: string;
  home: {
    logo: string;
    name: string;
  };
  away: {
    logo: string;
    name: string;
  };
  score: {
    home: number | null;
    away: number | null;
  };
  status: string;
}

interface PaginationProps {
  fixturesPerPage: number;
  totalFixtures: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

interface FixtureRowProps {
  fixture: {
    fixtureId: number;
    date: string;
    home: {
      logo: string;
      name: string;
    };
    away: {
      logo: string;
      name: string;
    };
    score: {
      home: number | null;
      away: number | null;
    };
    status: string;
  };
  homePrediction: number | null;
  awayPrediction: number | null;
  predictionPoints: number | null;
  submitState: { submitting: boolean; submitResult: string };
  onPredictionChange: (fixtureId: number, value: number | null, isHomePrediction: boolean) => void;
  onSubmitPrediction: (fixtureId: number) => void;
  past: boolean;
}

interface PredictionsListProps {
}

interface NavbarProps {}

interface LeagueListProps {}

interface MyLeaguesProps {
  leagueId?: string;
}

interface JoinLeagueProps {
  onJoinLeague: () => void;
}

interface CreateLeagueProps { 
  onJoinLeague: () => void;
}

interface Prediction {
  match: number;
  home: number | null;
  away: number | null;
}

interface LeagueTableProps {
  league: League;
}