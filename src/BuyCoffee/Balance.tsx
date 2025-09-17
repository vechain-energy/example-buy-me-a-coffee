import React from 'react';
import type { Token } from './types';
import { useThor, useWallet } from '@vechain/dapp-kit-react';
import { VET, Units, FixedPointNumber, Address, ABIItem, ABIFunction } from '@vechain/sdk-core';

type Props = {
    token?: Token
    onClick?: (balance: string) => void
}

export default function Balance({ token, onClick }: Props) {
    const { account } = useWallet()
    const thor = useThor()

    const [balance, setBalance] = React.useState("0")

    React.useEffect(() => {
        if (!account) return

        if (!token) {
            thor.accounts.getAccount(Address.of(account))
                .then(({ balance }) => {
                    setBalance(VET.of(balance).toString())
                })
                .catch((error: Error) => {
                    console.error(error)
                })
        }
        else {
            thor.contracts.executeCall(
                token.address,
                ABIItem.ofSignature(ABIFunction, 'function balanceOf(address owner) view returns (uint256)'),
                [account]
            )
                .then(({ result: { plain: balance } }) => {
                    setBalance(Units.formatUnits(FixedPointNumber.of(balance as bigint), token.decimals).toString())
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