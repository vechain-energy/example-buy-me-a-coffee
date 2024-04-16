import React from 'react';
import { APP_TITLE, RECIPIENT_ADDRESS } from '~/config';
import { useWallet, useConnex } from '@vechain/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';
import { clauseBuilder, unitsUtils } from '@vechain/sdk-core';
import Transaction from './Transaction';
import Error from '~/common/Error';

type Token = { address: string, symbol: String, name: string, decimals: number }

export default function BuyCoffee() {
    // get the connected wallet
    const { account } = useWallet();

    // and access to connex for interaction with vechain
    const connex = useConnex()

    // fetch the token registry, to display a list of tokens
    const tokenRegistry = useQuery<Token[]>({
        queryKey: ['tokenRegistry'],
        queryFn: async () => fetch('https://vechain.github.io/token-registry/main.json').then((res) => res.json())
    })

    // state for the currently selected token
    const [selectedToken, setSelectedToken] = React.useState<Token | undefined>()
    const handleSelectToken = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!tokenRegistry.data) { return setSelectedToken(undefined) }
        setSelectedToken(tokenRegistry.data.find((token: any) => token.address === event.target.value))
    }

    // state for the amount to send
    const [amount, setAmount] = React.useState<string>('')
    const handleChangeAmount = async (event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)

    // state for sending status
    const [txId, setTxId] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')
    const handleSend = async () => {
        if (!account || !RECIPIENT_ADDRESS) { return }

        try {
            setError('')
            const { txid } = await connex.vendor.sign('tx', [
                {
                    ...(
                        selectedToken
                            ? clauseBuilder.transferToken(selectedToken.address, RECIPIENT_ADDRESS, unitsUtils.parseUnits(amount, selectedToken.decimals))
                            : clauseBuilder.transferVET(RECIPIENT_ADDRESS, unitsUtils.parseVET(amount))
                    ),
                    comment: 'Send ' + amount + ' ' + (selectedToken?.symbol ?? 'VET'),
                }
            ])
                .request()
            setTxId(txid)
        }
        catch (err) {
            setError(String(err))
        }
    }


    if (!account) {
        return 'Please connect your wallet to continue.'
    }

    return (
        <div className='space-y-4'>
            <div>Welcome to {APP_TITLE}!</div>


            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-24 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="0"
                    autoComplete="off"
                    onChange={handleChangeAmount}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="token" className="sr-only">
                        Currency
                    </label>
                    {tokenRegistry.isSuccess && (
                        <select
                            name="token"
                            id="token"
                            onChange={handleSelectToken}
                            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 mr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                        >
                            <option value="">VET</option>
                            {tokenRegistry.data.map((token: any) => (<option key={token.address} value={token.address}>{token.symbol}</option>))}
                        </select>
                    )}
                </div>
            </div>

            <div>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!amount}
                    onClick={handleSend}
                >
                    send {amount} {selectedToken?.symbol ?? 'VET'}
                </button>

            </div>
            {tokenRegistry.isPending && <p>Loading Token Registry...</p>}

            {Boolean(error) && <Error>{error}</Error>}
            <Transaction txId={txId} />
        </div>
    )
}