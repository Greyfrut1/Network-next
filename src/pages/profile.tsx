import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import Link from 'next/link';

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
    const token = getCookieValue('token');
    fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch user data');
        setLoading(false);
      });
  }, []);

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
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-500 text-2xl font-bold">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-2xl font-bold">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto my-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">User Profile</h2>
        <nav className="mb-4">
          <Link className="text-blue-500 hover:text-blue-600" href={'/settings/profile'}>
            Settings
          </Link>
        </nav>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Name</h3>
            <p className="text-gray-700">{userData?.name}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold">Email</h3>
            <p className="text-gray-700">{userData?.email}</p>
          </div>
          {/* Additional user data can be displayed here */}
        </div>
      </div>
    </Layout>
  );
}