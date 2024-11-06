import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { useRouter } from 'next/router';

interface UserData {
  name: string;
  email: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
    

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = getCookieValue('token');

        const response = await fetch(
          `http://localhost:5000/api/profile/${router.query.id}`,
          {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Передаємо токен
              },
          }
        );
        const data = await response.json();
        setUserData(data[0]); // Зберігаємо дані користувача
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    }

    if (router.query.id) {
      fetchUserData();
    }
  }, [router.query.id]);
  


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
  if (!userData){
    return (
        <Layout>
          <div>User not found</div>
        </Layout>
      );
  }

  return (
    <Layout>
      <div>
        <h2>User Profile</h2>
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
        <p>
          <strong>Email:</strong> {userData?.email}
        </p>
        {/* Додаткові дані користувача можна тут відобразити */}
      </div>
    </Layout>
  );
}