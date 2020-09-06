import Head from 'next/head';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux'

import Layout from '../components/layout';
import { initializeStore } from '../store';

export default function Register(props) {
    const state = useSelector((state) => state)
    console.log(state);
    return (
        <Layout home>
            <div>Register</div>
        </Layout>
    )
}

// export function getServerSideProps() {
//     const reduxStore = initializeStore();
//     const { dispatch } = reduxStore;
//     return { props: reduxStore.getState() }
// }
