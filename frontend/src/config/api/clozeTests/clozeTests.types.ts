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

export interface SaveGapsData {
  id: string | undefined;
  gaps: DraftGaps;
}

export interface BackendCreateClozeTestDTO {
  title?: string;
  text: string;
  n_gaps: number;
}

export interface CreateClozeTestDTO {
  title?: string;
  text: string;
  numberOfGaps: number;
}

export interface BackendCreateClozeTestResponseDTO {
  task_id: string;
}

export interface CreateClozeTestResponseDTO {
  taskId: string;
}

export interface TaskStatus {
  task_id: string;
  task_info: {
    state: string;
    result: number;
  };
}

export type ClozeTestApi = {
  getClozeTests: () => Promise<ClozeTestListDTO[]>;
  getClozeTestDetail: (id: string | undefined) => Promise<ClozeTestDetailDTO>;
  getDraftClozeTestDetail: (
    id: string | undefined,
  ) => Promise<DraftClozeTestDetailDTO>;
  saveClozeTestGaps: (data: SaveGapsData) => Promise<DraftClozeTestDetailDTO>;
  saveClozeTest: (id: string | undefined) => Promise<ClozeTestDetailDTO>;
  createClozeTest: (
    data: CreateClozeTestDTO,
  ) => Promise<CreateClozeTestResponseDTO>;
  deleteClozeTest: (id: string) => Promise<void>;
};
