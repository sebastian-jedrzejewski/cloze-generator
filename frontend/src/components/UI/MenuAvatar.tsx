import { Avatar, Tooltip } from "@mui/material";
import { MeResponse } from "../../config/api/auth/auth.types";
import COLORS from "../../constants/colors";

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

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const luminance = (rgb: Array<number>) => {
  const [r, g, b] = rgb.map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const isColorDark = (hex: string) => {
  const rgb = hexToRgb(hex);
  const lum = luminance(rgb);
  return lum < 0.5;
};

const stringAvatar = (name: string) => {
  const hexColor = stringToColor(name);
  const isDark = isColorDark(hexColor);

  return {
    sx: {
      bgcolor: hexColor,
      cursor: "pointer",
      color: isDark ? "white" : COLORS.black200,
    },
    children: name[0].toUpperCase(),
  };
};

const MenuAvatar = (props: { user: MeResponse | undefined }) => {
  if (!props.user) {
    return null;
  }

  return (
    <Tooltip title={props.user.email}>
      <Avatar {...stringAvatar(props.user.email)} />
    </Tooltip>
  );
};

export default MenuAvatar;
