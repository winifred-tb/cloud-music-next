import Head from 'next/head';
import Link from 'next/link';
import { connect, useSelector, useDispatch } from 'react-redux';

import Layout from '../components/layout';

export default function Home(props) {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    return (
        <Layout home>
            <Head>
                <title>蘑菇</title>
            </Head>
            <Link href="/Register"><div>tb1</div></Link>
        </Layout>
    )
}
