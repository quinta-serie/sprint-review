import Page from '@/layout/Page';
import { userServices } from '@/services/core';

export default function Account() {
    const user = userServices.current;

    return (
        <Page title="Minha conta">
            name: {user.name}
            <br />
            email: {user.email}
        </Page>
    );
}