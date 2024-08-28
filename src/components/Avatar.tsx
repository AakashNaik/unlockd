import React, { useState } from 'react';
import { Avatar as MuiAvatar, Menu, MenuItem, IconButton } from '@mui/material';

interface AvatarProps {
  userDetails: {
    name: string;
    email: string;
    picture?: string;
  } | null;
  onSignOut: () => void;
  style?: React.CSSProperties;
}

const Avatar: React.FC<AvatarProps> = ({ userDetails, onSignOut, style }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!userDetails) return null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={style}>
      <IconButton onClick={handleClick}>
        <MuiAvatar src={userDetails.picture || undefined} alt={userDetails.name} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>{userDetails.email}</MenuItem>
        <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
      </Menu>
    </div>
  );
};

export default Avatar;