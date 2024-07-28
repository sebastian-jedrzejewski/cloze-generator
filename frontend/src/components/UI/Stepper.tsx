import * as React from "react";
import { styled } from "@mui/material/styles";
import MUIStepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TuneIcon from "@mui/icons-material/Tune";
import SaveIcon from "@mui/icons-material/Save";

import COLORS from "../../constants/colors";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(95deg, rgb(197, 79, 206) 0%, rgb(156, 39, 176) 50%, rgb(103, 58, 183) 100%);",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(95deg, rgb(197, 79, 206) 0%, rgb(156, 39, 176) 50%, rgb(103, 58, 183) 100%);",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : COLORS.gray500,
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(95deg, rgb(197, 79, 206) 0%, rgb(156, 39, 176) 50%, rgb(103, 58, 183) 100%);",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(95deg, rgb(197, 79, 206) 0%, rgb(156, 39, 176) 50%, rgb(103, 58, 183) 100%);",
  }),
}));

const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <TextFieldsIcon />,
    2: <TuneIcon />,
    3: <SaveIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
};

const steps = [
  "Enter your text",
  "Customize gaps based on model predictions",
  "Save your test",
];

const Stepper = () => {
  return (
    <MUIStepper
      alternativeLabel
      activeStep={1}
      connector={<ColorlibConnector />}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </MUIStepper>
  );
};

export default Stepper;
