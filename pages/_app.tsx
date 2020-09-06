import { Provider } from 'react-redux';
import { useStore } from '../store/index';

import '../styles/global.css';
import '../styles/index.less';

export default function App({ Component, pageProps }) {
    const store = useStore(pageProps.initialReduxState)

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
}
