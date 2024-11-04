import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
   const router = useRouter();
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Перевіряємо стан автентифікації при завантаженні компонента
   useEffect(() => {
     checkAuthStatus();
   }, []);

   // Функція для перевірки статусу автентифікації
   const checkAuthStatus = async () => {
     try {
       const response = await fetch('/api/auth/status');
       const data = await response.json();
       setIsAuthenticated(data.isAuthenticated);
     } catch (error) {
       console.error('Error checking auth status:', error);
       setIsAuthenticated(false);
     }
   };

   const handleLogout = async () => {
     try {
       await fetch('/api/logout', { method: 'POST' });
       setIsAuthenticated(false);
       router.push('/login');
     } catch (error) {
       console.error('Error during logout:', error);
     }
   };

   return (
     <header className="bg-blue-600 text-white p-4 shadow-md">
       <nav className="container mx-auto flex justify-between items-center">
         <div className="flex space-x-4">
           <Link href="/" className="text-lg font-semibold hover:text-gray-200">
             Home
           </Link>
           {isAuthenticated && (
             <Link href="/profile" className="text-lg font-semibold hover:text-gray-200">
               Profile
             </Link>
           )}
         </div>
         {isAuthenticated ? (
           <button 
             onClick={handleLogout} 
             className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
           >
             Logout
           </button>
         ) : (
           <Link 
             href="/login" 
             className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
           >
             Login
           </Link>
         )}
       </nav>
     </header>
   );
}