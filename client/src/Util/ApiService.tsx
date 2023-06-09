const BASE_URL = "http://localhost:4000";

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-all-users`);
    const users = await response.json();
    return users;
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
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const login = (email: string, password: string): Promise<any> => {
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
    console.log(competitions);
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