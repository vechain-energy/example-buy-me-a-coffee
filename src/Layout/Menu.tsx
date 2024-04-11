import { WalletButton } from "@vechain/dapp-kit-react";

export default function LayoutMenu() {
    return (
        <div style={{ display: 'flex', justifyContent: 'end' }}>
            <WalletButton />
        </div>
    )
}