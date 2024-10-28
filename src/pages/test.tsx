// pages/dashboard.tsx
import { GetServerSideProps } from 'next';
import Router from 'next/router';


export default function Dashboard() {
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    Router.push('/login');
  };
  return <div><h1>Welcome to your dashboard
  </h1>
    <form onSubmit={handleLogout}>
    <button type='submit'>Logout</button>
    </form></div>;
}

// Middleware для перевірки авторизації
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }

  // Додатково: верифікувати токен на сервері, якщо потрібно
  return { props: {} };
};
