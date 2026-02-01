import { apiClient } from "../lib/apiClient";
import { mockUserId } from "../lib/constants/mockData";

export async function fetchNodes(
  page: number,
  limit: number,
  search: string,
  parent_id?: number | null,
  orderBy?: string,
  orderDirection?: string
) {
  return apiClient(`v1/nodes?page=${page}&limit=${limit}&search=${search}&parentId=${parent_id || ""}&orderBy=${orderBy || "created_at"}&orderDirection=${orderDirection || "DESC"}`, {
    method: "GET",
  });
}

export async function createNodes(
  data:
    | {
        name?: string;
        description: string;
        type: "FILE" | "FOLDER";
        parent_id?: number | null;
      }
    | FormData
) {
  // FILE upload (FormData)
  if (data instanceof FormData) {
    data.append("created_by", mockUserId.toString());
    data.append("updated_by", mockUserId.toString());

    return apiClient("v1/nodes", {
      method: "POST",
      body: data,
      file: true,
    });
  }

  // FOLDER (JSON)
  return apiClient("v1/nodes", {
    method: "POST",
    body: {
      ...data,
      created_by: mockUserId,
      updated_by: mockUserId,
    },
    file: false,
  });
}

export async function deleteNode(id: number) {
  return apiClient(`v1/nodes/${id}`, {
    method: "DELETE",
  });
}

export async function deleteNodes(ids: number[]) {
  return apiClient(`v1/nodes`, {
    method: "DELETE",
    body: { ids },
  });
}

export async function fetchNode(id: number) {
  return apiClient(`v1/nodes/${id}`, {
    method: "GET",
  });
}

export async function updateNodes(
  id: string | number,
  data:
    | {
        name?: string;
        description?: string;
        parent_id?: string | null;
      }
    | FormData
) {
  // FILE update (FormData)
  if (data instanceof FormData) {
    data.append("updated_by", mockUserId.toString());

    return apiClient(`v1/nodes/${id}`, {
      method: "PUT",
      body: data,
      file: true,
    });
  }

  // FOLDER / metadata update (JSON)
  return apiClient(`v1/nodes/${id}`, {
    method: "PUT",
    body: {
      ...data,
      updated_by: mockUserId,
    },
  });
}
