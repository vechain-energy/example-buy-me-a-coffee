import React from 'react';
import type { Token } from './types';
import { useConnex, useWallet } from '@vechain/dapp-kit-react-privy';
import { VET, Units, FixedPointNumber } from '@vechain/sdk-core';
import type { AccountDetail } from '@vechain/sdk-network';

type Props = {
    token?: Token
    onClick?: (balance: string) => void
}

export default function Balance({ token, onClick }: Props) {
    const { selectedAddress: account } = useWallet()
    const connex = useConnex()

    const [balance, setBalance] = React.useState("0")

    React.useEffect(() => {
        if (!account) { return }

        if (!token) {
            connex.thor.account(account).get()
                .then(({ balance }: AccountDetail) => {
                    setBalance(VET.of(balance).toString())
                })
                .catch((error: Error) => {
                    console.error(error)
                })
        }
        else {
            connex.thor.account(token.address)
                .method(
                    {
                        "inputs": [{ "name": "owner", "type": "address" }],
                        "name": "balanceOf",
                        "outputs": [{ "name": "balance", "type": "uint256" }]
                    })
                .call(account)
                .then(({ decoded: { balance } }: { decoded: { balance: string } }) => {
                    setBalance(Units.formatUnits(FixedPointNumber.of(balance), token.decimals).toString())
                })
                .catch((error: Error) => {
                    console.error(error)
                })
        }
    }, [account, token])

    if (!account) { return null }

    const handleClick = () => onClick && onClick(balance)
    return (
        <span onClick={handleClick}>
            Balance: {balance}
        </span>
    )

}