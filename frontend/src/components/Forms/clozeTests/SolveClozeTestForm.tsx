import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

import { ClozeTestDetailDTO } from "../../../config/api/clozeTests/clozeTests.types";
import COLORS from "../../../constants/colors";

type Props = {
  test: ClozeTestDetailDTO;
};

const SolveClozeTestForm: React.FC<Props> = (props) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<number | null>(null);

  const { test } = props;
  const parts = test.rawTextWithGaps.split(test.gapIndicator);

  const checkAnswers = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let result = 0;
    for (const [index, element] of test.gaps.entries()) {
      if (
        answers[`gap${index}`]?.toLowerCase() === element.word.toLowerCase()
      ) {
        result += 1;
      }
    }
    setResult(result);
  };

  const resetTest = () => {
    setResult(null);
    setAnswers({});
  };

  return (
    <Box
      sx={{
        marginBottom: "2.5rem",
        width: "70%",
        textAlign: "center",
        ml: "auto",
        mr: "auto",
      }}
      component="form"
      onSubmit={checkAnswers}
    >
      <Typography sx={{ mb: "1.5rem" }}>
        Read the text below and think of the word which best fits each gap. Use
        only <strong>one</strong> word in each gap.
      </Typography>
      <Typography variant="h3" sx={{ mb: "1.1rem" }}>
        {test.title}
      </Typography>
      <Box sx={{ textAlign: "justify", mt: "0.5rem", fontSize: "1.2rem" }}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < part.split("\n").length - 1 && <br />}{" "}
              </React.Fragment>
            ))}
            {index < parts.length - 1 &&
              (result === null ? (
                <TextField
                  id={`gap${index}`}
                  value={answers[`gap${index}`] || ""}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAnswers((prevAnswers) => ({
                      ...prevAnswers,
                      [`gap${index}`]: event.target.value,
                    }));
                  }}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{
                    width: "10ch",
                    mx: "0.5ch",
                    my: "0.1rem",
                    verticalAlign: "middle",
                    "& .MuiInputBase-input": {
                      padding: "8px 10px",
                      textAlign: "center",
                    },
                  }}
                />
              ) : (
                <>
                  {answers[`gap${index}`]?.toLowerCase() !==
                    test.gaps[index].word.toLowerCase() && (
                    <s style={{ color: "red" }}>{answers[`gap${index}`]}</s>
                  )}{" "}
                  <span
                    style={{ color: answers[`gap${index}`] ? "green" : "red" }}
                  >
                    {test.gaps[index].word}
                  </span>
                </>
              ))}
          </React.Fragment>
        ))}
      </Box>
      {result === null ? (
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          sx={{ mt: "1rem" }}
        >
          Check answers
        </Button>
      ) : (
        <>
          <Button
            color="secondary"
            variant="contained"
            sx={{ mt: "1rem" }}
            onClick={resetTest}
          >
            Solve again
          </Button>
          <Typography variant="h4" sx={{ mt: "1rem" }}>
            Your result:{" "}
            <span
              style={{ color: result > test.gaps.length / 2 ? "green" : "red" }}
            >
              {result}
            </span>
            /<span style={{ color: COLORS.purple100 }}>{test.gaps.length}</span>
          </Typography>
        </>
      )}
    </Box>
  );
};

export default SolveClozeTestForm;
