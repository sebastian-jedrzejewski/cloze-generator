import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

import Stepper from "../components/UI/Stepper";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "2rem" }}>
      <Box
        sx={{
          marginBottom: "2.5rem",
          width: "70%",
          ml: "auto",
          mr: "auto",
        }}
      >
        <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
          Welcome to Cloze Generator!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          Open cloze tests are a part of Use of English in Cambridge
          certificates. Thanks to this app and the cutting-edge machine learning
          model, now it is possible to predict appropriate potential gaps for
          the given text and easily generate such tests. The model tries to
          choose such gaps so that there are no repetitions and gaps near to
          each other. It also proposes some alternatives if you aren't satisfied
          with the result. No matter if you are a teacher or a student, start
          generating open cloze tests today!
        </Typography>
      </Box>
      <Stepper />
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/tests/generate")}
        >
          Generate Open Cloze Test
        </Button>
      </Box>
    </Box>
  );
};

export default MainPage;
