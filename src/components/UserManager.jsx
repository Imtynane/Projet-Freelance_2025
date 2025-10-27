import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../services/api";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  // Charger les utilisateurs au montage
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
    }
  }

  // Ajouter un utilisateur
  async function handleAddUser(e) {
    e.preventDefault();
    try {
      const user = await createUser(newUser);
      setUsers([...users, user]); // ajoute à la liste sans recharger toute la BDD
      setNewUser({ name: "", email: "" }); // reset formulaire
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", err);
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Test API : Gestion Utilisateurs</h2>

      <form onSubmit={handleAddUser} className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nom"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          ➕ Ajouter
        </button>
      </form>

      <ul className="list-disc pl-6 text-gray-700">
        {users.map((user) => (
          <li key={user.id}>
            {user.name} <span className="text-sm text-gray-500">({user.email})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManager;