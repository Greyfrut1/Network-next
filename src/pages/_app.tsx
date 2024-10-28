// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../global.css'; // Import global styles here

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
