import { apiClient } from "../lib/apiClient";

export async function fetchNodes(
  page: number,
  limit: number,
  search: string
) {
  return apiClient(`v1/nodes?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
  });
}

export async function createNodes(
  data:
    | {
        name?: string;
        description: string;
        type: "FILE" | "FOLDER";
        parent_id?: string | null;
      }
    | FormData
) {
  // FILE upload (FormData)
  if (data instanceof FormData) {
    data.append("created_by", "1");
    data.append("updated_by", "1");

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
      created_by: 1,
      updated_by: 1,
    },
    file: false,
  });
}

export async function deleteNode(id: number) {
  return apiClient(`v1/nodes/${id}`, {
    method: "DELETE",
  });
}