import React from 'react';
import { APP_DESCRIPTION, APP_TITLE, RECIPIENT_ADDRESS } from '~/config';
import { useWallet, useConnex, useSendTransaction } from '@vechain/dapp-kit-react-privy';
import { Clause, Address, Units, VET, ABIContract } from '@vechain/sdk-core';
import Transaction from './Transaction';
import Error from '~/common/Error';
import SelectToken from './SelectToken';
import type { Token } from './types';
import Balance from './Balance';

export default function BuyCoffee() {
    // get the connected wallet
    const { selectedAddress: account } = useWallet()

    const {
        sendTransaction,
        txReceipt: txId,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error
    } = useSendTransaction({
        signerAccount: account,
        privyUIOptions: {
            title: 'Sign to confirm',
            description:
                'This is a test transaction performing a transfer of 1 B3TR tokens from your smart account.',
            buttonText: 'Sign',
        },
    });

    // state for the currently selected token
    const [selectedToken, setSelectedToken] = React.useState<Token | undefined>()

    // state for the amount to send
    const [amount, setAmount] = React.useState<string>('')
    const handleChangeAmount = async (event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)

    // state for sending status
    const handleSend = async () => {
        if (!account || !RECIPIENT_ADDRESS) { return }

        const transferABI = ABIContract.ofAbi([
            {
                "inputs": [
                    { "name": "recipient", "type": "address" },
                    { "name": "amount", "type": "uint256" }
                ],
                "name": "transfer",
                "outputs": [{ "name": "", "type": "bool" }],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]).getFunction('transfer')
        const clauses = [
            {
                ...(

                    // if a token was selected, transfer the token
                    selectedToken

                        // the clauseBuilder helps build the data for the transaction
                        ? Clause.callFunction(Address.of(selectedToken.address), transferABI, [Address.of(RECIPIENT_ADDRESS).toString(), Units.parseUnits(amount, selectedToken.decimals).toString()])

                        // or use the clauseBuilder to transfer VET by default
                        : Clause.transferVET(Address.of(RECIPIENT_ADDRESS), VET.of(amount))
                ),

                // an optional comment is shown to the user in the wallet
                comment: 'Send ' + amount + ' ' + (selectedToken?.symbol ?? 'VET'),
            }
        ]

        await sendTransaction(clauses)
    }


    if (!account) { return 'Please connect your wallet to continue.' }

    // sending is disabled if there is no signed in account or no amount entered
    const canSend = Boolean(account && amount)
    return (
        <div className='space-y-4 max-w-lg'>
            <div className='text-xl font-semibold'>{APP_TITLE}</div>
            <p>{APP_DESCRIPTION}</p>

            <div>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        className="block w-full rounded-md border-0 py-1.5 pl-2 pr-24 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="0"
                        autoComplete="off"
                        value={amount}
                        onChange={handleChangeAmount}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <SelectToken onChange={setSelectedToken} />
                    </div>
                </div>
                <div className='text-xs text-gray-400 text-right cursor-pointer'>
                    <Balance token={selectedToken} onClick={setAmount} />
                </div>
            </div>

            <div>
                <button
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!canSend ? 'opacity-25' : ''}`}
                    disabled={!canSend}
                    onClick={handleSend}
                >
                    send {amount} {selectedToken?.symbol ?? 'VET'}
                </button>

            </div>

            {Boolean(error) && <Error>{error?.reason}</Error>}
            <Transaction txId={txId} />
        </div>
    )
}