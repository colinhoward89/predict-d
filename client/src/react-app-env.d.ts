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
  id: string;
  name: string;
}