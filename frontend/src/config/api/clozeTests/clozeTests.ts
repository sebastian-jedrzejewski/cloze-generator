import axios from "axios";

import {
  BackendClozeTestListDTO,
  BackendClozeTestDetailDTO,
  ClozeTestApi,
  BackendDraftClozeTestDetailDTO,
  BackendCreateClozeTestResponseDTO,
} from "./clozeTests.types";
import {
  parseClozeTestDetailForFE,
  parseClozeTestListForFE,
  parseCreateClozeTestDataForBE,
  parseCreateClozeTestResponseDataForFE,
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
  getSharedTestDetails: async (id: string | undefined) => {
    const response = await axios.get<BackendClozeTestDetailDTO>(
      `${url}shared_test`,
      { params: { publish_uuid: id } },
    );
    return parseClozeTestDetailForFE(response.data);
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
  publishClozeTest: async (id) => {
    const response = await axios.post<{ publish_uuid: string }>(
      `${url}${id}/publish/`,
    );
    return { publishUuid: response.data.publish_uuid };
  },
  createClozeTest: async (data) => {
    const createData = parseCreateClozeTestDataForBE(data);
    const response = await axios.post<BackendCreateClozeTestResponseDTO>(
      url,
      createData,
    );
    return parseCreateClozeTestResponseDataForFE(response.data);
  },
  deleteClozeTest: async (id: string) => {
    await axios.delete(`${url}${id}`);
  },
};

export default clozeTestsApi;
