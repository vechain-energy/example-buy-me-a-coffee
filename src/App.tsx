import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { NODE_URL, WALLET_CONNECT_PROJECT_ID, APP_TITLE, APP_DESCRIPTION, APP_ICONS } from '~/config';
import { Helmet } from "react-helmet";
import Layout from './Layout';

// define wallet connect options only in case a project id has been provided
const walletConnectOptions = !WALLET_CONNECT_PROJECT_ID ? undefined : {
    projectId: WALLET_CONNECT_PROJECT_ID,
    metadata: {
        name: APP_TITLE,
        description: APP_DESCRIPTION,
        url: window.location.origin,
        icons: APP_ICONS
    },
};

export default function App() {
    return (
        <Provider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE}</title>
            </Helmet>

            <Layout />
        </Provider>
    )
}

function Provider({ children }: { children: React.ReactNode }) {
    return (
        <DAppKitProvider
            // the network & node to connect to
            nodeUrl={NODE_URL}
            // remember last connected address on page reload
            usePersistence={true}
            // optionally enable walletConnect, which will be used for mobile wallets
            walletConnectOptions={walletConnectOptions}
        >
            {children}
        </DAppKitProvider>
    );
}