import { Button, Flex, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Outlet, Link, useLocation } from "react-router-dom";
export default function Root() {

    const { tokens } = useTheme();
    const hideNavbarPaths = ['/exam'];
    const location = useLocation();
    return (
        <>
            {(!hideNavbarPaths.includes(location.pathname)) ?
                <nav>
                    <Flex justifyContent="flex-end">
                        <Button backgroundColor={tokens.colors.blue[40]} ><Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></Button>


                        <Button backgroundColor={tokens.colors.blue[40]} ><Link to={'/test'} style={{ textDecoration: 'none', color: 'inherit' }}>Take Test</Link></Button>

                        <Button backgroundColor={tokens.colors.blue[40]}><Link to={'/myscore'} style={{ textDecoration: 'none', color: 'inherit' }}>My Score</Link></Button>
                    </Flex>
                </nav> : <></>
            }
            <Outlet />

        </>
    );
}