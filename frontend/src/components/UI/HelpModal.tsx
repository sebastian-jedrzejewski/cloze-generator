import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import COLORS from "../../constants/colors";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", md: "50%", lg: "40%", xl: "30%" },
  maxHeight: "80%",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

type Props = {
  open: boolean;
  handleClose: () => void;
};

const HelpModal: React.FC<Props> = (props) => {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", color: COLORS.purple100 }}
          >
            How it works
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, textAlign: "justify", color: COLORS.black200 }}
          >
            The model predicts potential gaps for the text you entered
            previously. It selects the best set of N gaps (the number of gaps
            you have chosen) to ensure the test is of high quality, meaning
            there are no gaps too close to each other and no repetitions. This
            optimal set of gaps is marked in purple. The selection phase occurs
            if the model predicts more gaps than you requested. In this case,
            additional alternative gaps are listed in the right panel. <br />
            <br />
            You can customize your test based on the predicted gaps and
            alternatives if you think other gaps would improve the test quality.
            To do this, simply click on a gap or an alternative from the list
            and select "Add gap" or "Remove gap". This will update your current
            set of gaps. When you are satisfied with the result, click "Save
            test" to generate the open cloze test. You can then print your test,
            if needed.
            <br />
            <br />
            <span style={{ fontWeight: "bold", color: COLORS.purple100 }}>
              NOTE:
            </span>{" "}
            If the text you entered lacks sufficient diversity in vocabulary or
            grammar, the model might predict fewer gaps than you requested.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default HelpModal;
