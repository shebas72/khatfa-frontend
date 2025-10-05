import { useTheme } from "@emotion/react";
// import LocalPhoneIcon from "@mui/icons-material/PhoneIcon";
import EmailIcon from "@mui/icons-material/Email";
import { Typography } from "@mui/material";
import { TopBarButton } from "./header/NavBar.style";
import ClickToCall from "./header/top-navbar/ClickToCall";
import Link from "next/link";

const CallToAdmin = ({ configData }) => {
  const theme = useTheme();

  return (
    <Link href={`mailto:${configData?.email}`}>
      <TopBarButton
        size="small"
        variant="text"
        sx={{
          ".MuiTypography-body1": {
            transition: "all ease 0.5s",
          },
          "&:hover .MuiTypography-body1": {
            color: theme.palette.primary.main + "!important",
          },
        }}
        startIcon={
          <EmailIcon
            sx={{
              ml: 1,
              color: (theme) => theme.palette.neutral[1000],
            }}
          />
        }
      >
        <Typography sx={{ color: (theme) => theme.palette.neutral[1000] }}>
          {configData?.email}
        </Typography>
      </TopBarButton>
    </Link>
  );
};

CallToAdmin.propTypes = {};

export default CallToAdmin;
