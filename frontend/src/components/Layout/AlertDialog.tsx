import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  isOpen: boolean;
  closeHandler: () => void;
  title: string;
  contentText?: string;
  agreeButton: React.ReactNode;
  cancelButtonText: string;
};

const AlertDialog: React.FC<Props> = (props) => {
  const {
    isOpen,
    closeHandler,
    title,
    contentText,
    agreeButton,
    cancelButtonText,
  } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={closeHandler}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={closeHandler}>
          {cancelButtonText}
        </Button>
        {agreeButton}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
