const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-all-users`);
    const users = await response.json();

    const userTeamsData = users.map((user: any) => ({
      id: user._id,
      team: user.team,
    }));

    return userTeamsData;
  } catch (error) {
    console.error("Error getting users:", error);
  }
};

export const getUser = async (email: String) => {
  try {
    const response = await fetch(`${BASE_URL}/getuser/${email}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
  }
};

export const createUser = async (email: UserData['email'], team: UserData['team'], password: UserData['password']) => {
  try {
    const requestBody = {
      email: email,
      team: team,
      password: password
    };
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  const requestBody = {
    email: email,
    password: password
  }
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const logout = (): Promise<any> => {
  return fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const updateUser = async (updatedUser: UserData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${updatedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const getAllComps = async () => {
  try {
    const response = await fetch(`${BASE_URL}/competitions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const competitions = await response.json();
    return competitions;
  } catch (error) {
    console.error("Error retrieving competitions:", error);
  }
};

export const getAllFixtures = async (compID: Competition["id"]) => {
  try {
    const response = await fetch(`${BASE_URL}/${compID}/fixtures`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const competitions = await response.json();
    return competitions;
  } catch (error) {
    console.error("Error retrieving fixtures:", error);
  }
};

export const getAllFixturesFiltered = async (compID: Competition["id"]) => {
  try {
    const response = await fetch(`${BASE_URL}/${compID}/fixtures`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const fixtures = await response.json();
    const fixturesFiltered = fixtures.filter((fixture: Fixture) => fixture.status === 'FT');
    return fixturesFiltered;
  } catch (error) {
    console.error("Error retrieving fixtures:", error);
  }
};

export const createLeague = async (name: string, competition: number, admin: string) => {
  try {
    const response = await fetch(`${BASE_URL}/createleague`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        competition,
        admin,
        players: [
          {
            user: admin,
            predictions: [],
            points: 0,
            goals: 0,
          },
        ],
      }),
    });
    if (response.ok) {
    } else {
    }
  } catch (error) {
    console.error('Failed to create league', error);
  }
};

export const getLeague = async (leagueId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/league/${leagueId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const league = await response.json();
    return league.players;
  } catch (error) {
    console.error('Failed to get leagues', error);
    throw new Error('Failed to get leagues');
  }
};


export const getMyLeagues = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/myleagues/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const myLeagues = await response.json();
    return myLeagues;
  } catch (error) {
    console.error('Failed to get leagues', error);
    throw new Error('Failed to get leagues');
  }
};

export const getLeaguesToJoin = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/joinleagues/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch leagues to join');
    }
    const leaguesToJoin = await response.json();
    return leaguesToJoin;
  } catch (error) {
    console.error('Failed to fetch leagues to join', error);
    throw new Error('Failed to fetch leagues to join');
  }
};

export const joinLeague = async (leagueId: string, userID: string) => {
  try {
    const response = await fetch(`${BASE_URL}/joinleague`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leagueId, userID }),
    });

    if (!response.ok) {
      throw new Error('Failed to join the league');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to join the league', error);
    throw new Error('Failed to join the league');
  }
};

export const submitPrediction = async (userID: string, match: number, home: number | null, away: number | null) => {
  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID, match, home, away }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit prediction');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to submit prediction', error);
    throw new Error('Failed to submit prediction');
  }
}

export const editPrediction = async (userID: string, match: number, home: number | null, away: number | null) => {
  try {
    const response = await fetch(`${BASE_URL}/editpredict/${userID}/${match}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ home, away }),
    });
    if (!response.ok) {
      throw new Error('Failed to edit prediction');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to edit prediction', error);
    throw new Error('Failed to edit prediction');
  }
};

export const getPrediction = async (userId: string, fixtureId: number) => {
  try {
    const queryString = `userId=${userId}&fixtureId=${fixtureId}`;
    const response = await fetch(`${BASE_URL}/predictions?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch prediction');
  }
};

export const getAllPredictions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/allpredictions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch predictions');
  }
};


export const updateLeague = async (league: any) => {
  if (league._id === null) {
    throw new Error('League ID is null');
  }
  try {
    const response = await fetch(`${BASE_URL}/updateleague/${league._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(league),
    });

    if (!response.ok) {
      throw new Error('Failed to update league');
    }
  } catch (error) {
    console.error('Failed to update league:', error);
    throw error;
  }
};


export const updatePrediction = async (predictionId: number, updatedPrediction: any) => {

  try {
    const response = await fetch(`${BASE_URL}/updatepredictions/${predictionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPrediction),
    });

    if (!response.ok) {
      throw new Error('Failed to update prediction');
    }
  } catch (error) {
    console.error('Failed to update prediction:', error);
    throw error;
  }
};

export const getTeamForm = async (teamID: any) => {
  try {
    const response = await fetch(`${BASE_URL}/teamform/${teamID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const teamForm = await response.json();
    return teamForm;
  } catch (error) {
    console.error("Error retrieving fixtures:", error);
  }
};

export const getPredictionsFromAI = async (teamForms: any) => {
  try {
    const response = await fetch(`${BASE_URL}/aipredictions`, {
      method: "POST",
      body: JSON.stringify({ teamForms }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const formattedResponse = data.aiResponse;
    const AIPredictions = JSON.parse(formattedResponse.replace(/FixtureID/g, '"FixtureID"').replace(/Score/g, '"Score"').replace(/Home/g, '"Home"').replace(/Away/g, '"Away"'));
    return AIPredictions;
  } catch (error) {
    console.error("Error retrieving fixtures:", error);
  }
};