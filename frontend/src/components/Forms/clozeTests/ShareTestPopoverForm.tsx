import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Box, IconButton, TextField, Tooltip } from "@mui/material";
import Popover from "@mui/material/Popover";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { ClozeTestDetailDTO } from "../../../config/api/clozeTests/clozeTests.types";
import { FRONTEND_BASE_URL } from "../../../constants/api";
import { AuthContext } from "../../../store/AuthContext/AuthContext";
import clozeTestsApi from "../../../config/api/clozeTests/clozeTests";
import { queryClient } from "../../../config/api";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";
import MESSAGES from "../../../constants/messages";

type Props = {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  test: ClozeTestDetailDTO;
};

const ShareTestPopoverForm: React.FC<Props> = (props) => {
  const { anchorEl, setAnchorEl, test } = props;
  const [copyText, setCopyText] = React.useState("Click to copy");
  const { isAuthenticated } = React.useContext(AuthContext);
  const { mutate, isPending, isError } = useMutation({
    mutationFn: clozeTestsApi.publishClozeTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clozeTests", test.id] });
    },
  });

  React.useEffect(() => {
    if (Boolean(anchorEl) && !test.publishUuid) {
      mutate(test.id);
    }
  }, [props]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "share-popover" : undefined;

  const buildShareUrl = (publishUuid: string) => {
    return `${FRONTEND_BASE_URL}/cloze-tests/solve?share=${publishUuid}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildShareUrl(test.publishUuid));
    setCopyText("Copied");
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{ p: "1rem" }}
    >
      {isError && (
        <ErrorMessage
          message={MESSAGES.SOMETHING_WENT_WRONG}
          sx={{ mx: "10rem" }}
        />
      )}
      {isPending && <LoadingSpinner boxSx={{ mx: "10rem", my: "1rem" }} />}
      {!isError && !isPending && (
        <Box sx={{ display: "flex", p: "1rem", columnGap: 1 }}>
          <TextField
            color="secondary"
            value={buildShareUrl(test.publishUuid)}
            sx={{ width: "35rem" }}
          />
          <Tooltip
            title={
              window.isSecureContext ? copyText : "Copying over HTTP disabled"
            }
            placement="top"
          >
            <IconButton
              aria-label="copy"
              onClick={copyToClipboard}
              onMouseLeave={() => setCopyText("Click to copy")}
              disabled={!window.isSecureContext}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      {!isAuthenticated && (
        <Box sx={{ px: "1rem", pb: "1rem" }}>
          <Alert severity="warning">
            This link will remain active for 1 hour. To ensure your links never
            expire, please log in.
          </Alert>
        </Box>
      )}
    </Popover>
  );
};

export default ShareTestPopoverForm;
