import Menu from './Menu';
import { APP_TITLE, APP_DESCRIPTION } from '~/config';

export default function Layout() {
    return (
        <div>
            <Menu />

            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                <>Welcome to {APP_TITLE}!</>
                <p>{APP_DESCRIPTION}</p>
            </div>
        </div>
    )
}