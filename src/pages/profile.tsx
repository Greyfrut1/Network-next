//pages/profile.tsx
import { useEffect, useState } from 'react';
import Layout from '../components/layout';

interface UserData {
  name: string;
  email: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL as string;


export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Отримуємо токен з кукі
    const token = getCookieValue('token');
    console.log(token)
    // Виконуємо запит для отримання даних користувача
    fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Передаємо токен
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data[0]); // Зберігаємо дані користувача
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch user data');
        setLoading(false);
      });
  }, []);

  // Допоміжна функція для отримання значення кукі
  const getCookieValue = (cookieName: string): string | null => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>{error}</div>
      </Layout>
    );
  }
  console.log(userData)
  return (
    <Layout>
      <div>
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {userData?.name}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        {/* Додаткові дані користувача можна тут відобразити */}
      </div>
    </Layout>
  );
}