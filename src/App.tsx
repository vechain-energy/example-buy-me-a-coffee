import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { DAppKitPrivyProvider } from '@vechain/dapp-kit-react-privy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NODE_URL, NETWORK, WALLET_CONNECT_PROJECT_ID, APP_TITLE, APP_DESCRIPTION, APP_ICONS } from '~/config';
import { Helmet } from "react-helmet";
import Layout from './Layout';
import BuyCoffee from './BuyCoffee';

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

// query client for react-query
const queryClient = new QueryClient()

export default function App() {
    return (
        <Providers>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE}</title>
            </Helmet>

            <Layout>
                <BuyCoffee />
            </Layout>
        </Providers>
    )
}

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <DAppKitPrivyProvider
                privyConfig={{
                    appId: process.env.PRIVY_APP_ID ?? '',
                    clientId: process.env.PRIVY_CLIENT_ID ?? '',
                    loginMethods: ['google', 'twitter', 'github', 'sms', 'email'],
                    appearance: {
                        theme: 'light',
                        accentColor: '#696FFD',
                        loginMessage: 'Select a social media profile',
                        logo: 'https://i.ibb.co/ZHGmq3y/image-21.png',
                    },
                    embeddedWallets: {
                        createOnLogin: 'all-users',
                    },
                    ecosystemAppsID: [
                        'clz41gcg00e4ay75dmq3uzzgr', //cleanify
                        'clxdoatq601h35inz6qykgmai',
                        'clpgf04wn04hnkw0fv1m11mnb',
                        'clrtmg1n104ypl60p9w5c3v4c',
                    ],
                    allowPasskeyLinking: true,
                }}
                feeDelegationConfig={{
                    delegatorUrl: process.env.DELEGATOR_URL ?? '',
                    delegateAllTransactions: true,
                }}
                dappKitConfig={{
                    // the network & node to connect to
                    nodeUrl: NODE_URL,
                    genesis: NETWORK,
                    // remember last connected address on page reload
                    usePersistence: true,
                    // optionally enable walletConnect, which will be used for mobile wallets
                    walletConnectOptions: walletConnectOptions
                }}
            >
                {children}
            </DAppKitPrivyProvider>
        </QueryClientProvider>
    );
}