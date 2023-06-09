/// <reference types="react-scripts" />

interface UserData {
  email: string;
  password: string;
  team: string;
  image: string | undefined;
  id?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface Competition {
  id: number;
  name: string;
  type: string;
  logo: string;
  countryName: string;
}