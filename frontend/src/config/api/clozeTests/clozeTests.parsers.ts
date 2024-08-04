import {
  BackendClozeTestDetailDTO,
  BackendClozeTestListDTO,
  BackendDraftClozeTestDetailDTO,
  ClozeTestDetailDTO,
  ClozeTestListDTO,
  DraftClozeTestDetailDTO,
} from "./clozeTests.types";

export const parseClozeTestListForFE = (
  data: BackendClozeTestListDTO[],
): ClozeTestListDTO[] => {
  return data.map((item) => ({
    id: item.id,
    createdAt: new Date(item.created_at),
    isDraft: item.is_draft,
    title: item.title,
    shortTitle: item.short_title,
  }));
};

const replaceBlanks = (text: string, gapIndicator: string) => {
  let count = 1;
  const regex = new RegExp(
    gapIndicator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "g",
  );
  return text.replace(
    regex,
    () =>
      `<span style="color: #9C27B0; font-weight: bold">(${count++}) ........</span>`,
  );
};

export const parseClozeTestDetailForFE = (
  data: BackendClozeTestDetailDTO,
): ClozeTestDetailDTO => {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    isDraft: data.is_draft,
    title: data.title,
    shortTitle: data.short_title,
    gapIndicator: data.gap_indicator,
    textWithGaps: replaceBlanks(data.text_with_gaps, data.gap_indicator),
    gaps: data.gaps,
  };
};

export const parseDraftClozeTestDetailForFE = (
  data: BackendDraftClozeTestDetailDTO,
): DraftClozeTestDetailDTO => {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    isDraft: data.is_draft,
    title: data.title,
    shortTitle: data.short_title,
    gapIndicator: data.gap_indicator,
    textWithGaps: data.text_with_gaps,
    gaps: {
      predictedGaps: data.gaps.predicted_gaps,
      alternatives: data.gaps.alternatives,
    },
  };
};
