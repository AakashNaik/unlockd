import { Button, Flex, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Outlet, Link, useLocation } from "react-router-dom";
export default function Root() {

    const { tokens } = useTheme();
    const hideNavbarPaths = ['/exam'];
    const location = useLocation();
    return (
        <>
            {(!hideNavbarPaths.includes(location.pathname))?
            <nav>
                <Flex justifyContent="flex-end">
                    <Button backgroundColor={tokens.colors.blue[40]}><Link to={'/test'}>Take Test</Link></Button>

                    <Button backgroundColor={tokens.colors.blue[40]}><Link to={'/myscore'}>My Score</Link></Button>
                </Flex>
            </nav>:<></>
            }
            <Outlet />

        </>
    );
}