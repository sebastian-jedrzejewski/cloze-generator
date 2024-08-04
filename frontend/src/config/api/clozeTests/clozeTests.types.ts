export interface BackendClozeTestListDTO {
  id: number;
  created_at: string;
  title: string;
  short_title: string;
  is_draft: boolean;
}

export interface ClozeTestListDTO {
  id: number;
  createdAt: Date;
  title: string;
  shortTitle: string;
  isDraft: boolean;
}

export interface Gap {
  entity: "GAP" | "NON-GAP";
  score: number;
  index: number;
  word: string;
  start: number;
  end: number;
}

export interface BackendDraftGaps {
  predicted_gaps: Gap[];
  alternatives: Gap[];
}

export interface DraftGaps {
  predictedGaps: Gap[];
  alternatives: Gap[];
}

export interface BackendClozeTestDetailDTO extends BackendClozeTestListDTO {
  text_with_gaps: string;
  gap_indicator: string;
  gaps: Gap[];
}

export interface ClozeTestDetailDTO extends ClozeTestListDTO {
  textWithGaps: string;
  gapIndicator: string;
  gaps: Gap[];
}

export interface BackendDraftClozeTestDetailDTO
  extends BackendClozeTestListDTO {
  text_with_gaps: string;
  gap_indicator: string;
  gaps: BackendDraftGaps;
}

export interface DraftClozeTestDetailDTO extends ClozeTestListDTO {
  textWithGaps: string;
  gapIndicator: string;
  gaps: DraftGaps;
}

export type ClozeTestApi = {
  getClozeTests: () => Promise<ClozeTestListDTO[]>;
  getClozeTestDetail: (id: string | undefined) => Promise<ClozeTestDetailDTO>;
  getDraftClozeTestDetail: (
    id: string | undefined,
  ) => Promise<DraftClozeTestDetailDTO>;
  deleteClozeTest: (id: string) => Promise<void>;
};
