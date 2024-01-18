import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import WalletButton from "components/WalletButton";
import logo from "assets/svg/logo.svg";

const Header = () => {
  return (
    <Grid
      maxWidth={"1600px"}
      marginX={"auto"}
      container
      flexDirection={{ xs: "column", sm: "row" }}
      gap={2}
      justifyContent={"space-between"}
      alignItems={"center"}
      paddingX={{ xs: "30px", sm: "80px" }}
      paddingY={{ xs: "40px" }}
    >
      <Grid container gap={1} width={"fit-content"} alignItems={"center"}>
        <img src={logo} alt="logo" />
        <Typography
          align="center"
          fontSize={"25px"}
          fontFamily={"Acme"}
          fontStyle={"normal"}
          lineHeight={"32px"}
          color={"#FFFFFF"}
          textAlign={"center"}
        >
          Spin to Win
        </Typography>
      </Grid>
      <WalletButton />
    </Grid>
  );
};

export default Header;
