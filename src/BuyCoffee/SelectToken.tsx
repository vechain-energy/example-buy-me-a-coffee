import { useQuery } from '@tanstack/react-query';
import { NETWORK } from '~/config';
import { ArrowPathIcon as IconLoading } from '@heroicons/react/24/outline'
import type { Token } from './types';

type Props = {
    onChange: (token: Token | undefined) => void
}

export default function SelectToken({ onChange }: Props) {

    // fetch the token registry, to display a list of tokens
    const tokenRegistry = useQuery<Token[]>({
        queryKey: ['tokenRegistry'],
        queryFn: async () => fetch(`https://vechain.github.io/token-registry/${NETWORK}.json`).then((res) => res.json())
    })

    // when a token is selected, call the onChange function with the selected token
    const handleSelectToken = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!tokenRegistry.data || !event.target.value) { return onChange(undefined) }
        onChange(tokenRegistry.data.find((token) => token.address === event.target.value))
    }

    // loading indicator while fetching the token registry
    if (tokenRegistry.isLoading) {
        return <IconLoading className="h-4 w-4 text-gray-400 animate-spin mx-2" aria-hidden="true" />
    }

    return (
        <>
            <label htmlFor="token" className="sr-only">
                Token
            </label>
            <select
                name="token"
                id="token"
                onChange={handleSelectToken}
                className="h-full rounded-md border-0 bg-transparent py-0 pl-2 mr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            >
                <option value="">VET</option>
                {tokenRegistry.data?.map((token) => (<option key={token.address} value={token.address}>{token.symbol}</option>))}
            </select>
        </>
    )
}