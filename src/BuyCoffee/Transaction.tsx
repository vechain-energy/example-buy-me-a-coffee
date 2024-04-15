import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { NODE_URL } from '~/config';
import type { TransactionReceipt } from '@vechain/sdk-network';

export default function TransactionStatus({ txId }: { txId: string }) {
    // fetch the transaction receipt
    const [hasReceipt, setHasReceipt] = React.useState<boolean>(false)
    const receipt = useQuery<TransactionReceipt | null>({
        queryKey: ['transaction', txId],
        queryFn: async () => fetch(`${NODE_URL}/transactions/${txId}/receipt`).then((res) => res.json()) as Promise<TransactionReceipt | null>,
        refetchInterval: 7000,
        placeholderData: (previousData) => previousData,
        enabled: Boolean(txId) && !hasReceipt
    })

    React.useEffect(() => {
        if (receipt.data) { setHasReceipt(true) }
    }, [receipt.data])

    if(!txId) {
        return null
    }

    if (!receipt.data) {
        return <>Waiting for Transaction..</>
    }

    if (receipt.data.reverted) {
        return <>Transaction Reverted</>
    }

    return (
        <>
            Success
        </>
    )
}