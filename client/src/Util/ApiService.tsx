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

export const createUser = async (newUser: User) => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const updateUser = async (updatedUser: User) => {
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