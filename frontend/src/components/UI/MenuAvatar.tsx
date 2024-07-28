import { Avatar, Tooltip } from "@mui/material";

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      cursor: "pointer",
    },
    children: name[0].toUpperCase(),
  };
};

const MenuAvatar = () => {
  return (
    <Tooltip title="sebastian.jedrzejewski@email.com">
      <Avatar {...stringAvatar("sebastian.jedrzejewski@email.com")} />
    </Tooltip>
  );
};

export default MenuAvatar;
