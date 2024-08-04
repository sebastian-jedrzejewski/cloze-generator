import axios from "axios";

import {
  BackendClozeTestListDTO,
  BackendClozeTestDetailDTO,
  ClozeTestApi,
  BackendDraftClozeTestDetailDTO,
} from "./clozeTests.types";
import {
  parseClozeTestDetailForFE,
  parseClozeTestListForFE,
  parseDraftClozeTestDetailForFE,
} from "./clozeTests.parsers";

const url = "/cloze_tests/";

const clozeTestsApi: ClozeTestApi = {
  getClozeTests: async () => {
    const response = await axios.get<BackendClozeTestListDTO[]>(url);
    return parseClozeTestListForFE(response.data);
  },
  getClozeTestDetail: async (id: string | undefined) => {
    const response = await axios.get<BackendClozeTestDetailDTO>(`${url}${id}`);
    return parseClozeTestDetailForFE(response.data);
  },
  getDraftClozeTestDetail: async (id: string | undefined) => {
    const response = await axios.get<BackendDraftClozeTestDetailDTO>(
      `${url}${id}`,
    );
    return parseDraftClozeTestDetailForFE(response.data);
  },
  saveClozeTestGaps: async ({ id, gaps }) => {
    const response = await axios.patch<BackendDraftClozeTestDetailDTO>(
      `${url}${id}/`,
      {
        gaps: {
          predicted_gaps: gaps.predictedGaps,
          alternatives: gaps.alternatives,
        },
      },
    );
    return parseDraftClozeTestDetailForFE(response.data);
  },
  saveClozeTest: async (id) => {
    const response = await axios.post<BackendClozeTestDetailDTO>(
      `${url}${id}/save_test/`,
    );
    return parseClozeTestDetailForFE(response.data);
  },
  deleteClozeTest: async (id: string) => {
    await axios.delete(`${url}${id}`);
  },
};

export default clozeTestsApi;
