/// <reference types="react-scripts" />

interface User {
  email: string;
  password: string;
  team: string;
  image: string | undefined;
  id?: string;
}

interface Competition {
  id: number;
  name: string;
  type: string;
  logo: string;
  countryName: string;
}