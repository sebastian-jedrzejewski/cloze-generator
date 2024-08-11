import { Box } from "@mui/material";

import CreateClozeTestForm from "../../components/Forms/clozeTests/CreateClozeTestForm";

const CreateClozeTestPage = () => {
  return (
    <Box sx={{ padding: "2rem", width: "100%", height: "100%" }}>
      <CreateClozeTestForm />
    </Box>
  );
};

export default CreateClozeTestPage;
