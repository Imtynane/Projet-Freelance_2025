import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">👤 Mon profil</h1>

      {user ? (
        <ul className="space-y-2 text-gray-700">
          <li><strong>Nom :</strong> {user.name}</li>
          <li><strong>Email :</strong> {user.email}</li>
        </ul>
      ) : (
        <p className="text-gray-500">Aucune information utilisateur.</p>
      )}
    </div>
  );
}
