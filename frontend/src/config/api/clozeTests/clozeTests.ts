import axios from "axios";

import {
  BackendClozeTestListDTO,
  BackendClozeTestDetailDTO,
  ClozeTestApi,
} from "./clozeTests.types";
import {
  parseClozeTestDetailForFE,
  parseClozeTestListForFE,
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
};

export default clozeTestsApi;
