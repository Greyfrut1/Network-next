import Layout from '../components/layout';
import { useState } from 'react';

export default function Users(){
    const [userData, setUserData] = useState<string | null>(null);

    return(
        <Layout>
            users
        </Layout>
    )
}