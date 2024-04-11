import Menu from './Menu';
import { APP_TITLE, APP_DESCRIPTION } from '~/config';

export default function Layout() {
    return (
        <div className='space-y-4 p-4'>
            <div className='flex justify-end'><Menu /></div>
            <div className='flex justify-center'>
                <>Welcome to {APP_TITLE}!</>
                <p>{APP_DESCRIPTION}</p>
            </div>
        </div>
    )
}