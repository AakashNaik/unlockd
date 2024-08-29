import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../components/HomePage";
import Avatar from "../components/Avatar"; // Create this component
import {  fetchUserAttributes } from "@aws-amplify/auth";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";

// Update the UserDetails interface
interface UserDetails {
  name: string;
  email: string; // Remove the optional '?'
  picture?: string;
}

export default function Root() {
  return (
    <Authenticator.Provider>
      <AuthenticatedContent />
    </Authenticator.Provider>
  );
}

function AuthenticatedContent() {
  const hideNavbarPaths = ["/exam", "/test", "/myscore"];
  const location = useLocation();
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (user) {
      const fetchAttributes = async () => {
        const attributes = await fetchUserAttributes();
        setUserDetails({
          name: attributes.name || "User",
          email: attributes.email || "",
          picture: attributes.picture
        });
      };
      fetchAttributes();
    }
  }, [user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <Authenticator socialProviders={["google"]}>
        {({}) => (
          <div style={{ position: 'relative' }}>
            {!hideNavbarPaths.includes(location.pathname) && <HomePage />}
            <IconButton
              onClick={handleMenuOpen}
              style={{
                position: 'absolute',
                top: '0px',
                right: '10px',
                zIndex: 1000
              }}
            >
              <Avatar 
                userDetails={userDetails}
                onSignOut={handleSignOut}
              />
            </IconButton>
         
            <Outlet />
          </div>
        )}
      </Authenticator>
    </>
  );
}
