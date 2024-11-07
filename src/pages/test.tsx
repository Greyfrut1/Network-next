// pages/test.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/layout'


export default function Dashboard() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };
  return <Layout>
  <div><h1>Welcome to your dashboard
  </h1>
    <form onSubmit={handleLogout}>
    <button type='submit'>Logout</button>
    </form></div></Layout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }

  return { props: {} };
};
