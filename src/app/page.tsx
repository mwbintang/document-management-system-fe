"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { HeadTitle } from "../components/HeadTitle";
import { SearchBar } from "../components/SearchBar";
import { Table } from "../components/Table/Table";
import { Plus, Upload } from "lucide-react";
import { createNodes, deleteNode, deleteNodes, fetchNode, fetchNodes, updateNodes } from "../services/nodes";
// import { useDebounceFn } from "../lib/hooks/useDebounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FileFormModal } from "../components/Modal/FileFormModal";
import { FolderFormModal } from "../components/Modal/FolderFormModal";
import { API_BASE_URL } from "../lib/constants/env";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "username", label: "Created by" },
  { key: "created_at", label: "Date", sortable: true, date: true },
  { key: "size", label: "Size" },
];

interface NodeItem {
  id: number;
  name: string;
  type: "FILE" | "FOLDER";
  size: number | null; 
  created_at: string; 
  username: string;
  isBack?: boolean
};

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const parentIdParam = searchParams.get("parent_id");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [openFileModal, setOpenFileModal] = useState<boolean>(false);
  const [openFolderModal, setOpenFolderModal] = useState<boolean>(false);

  const [folderName, setFolderName] = useState<string>("");
  const [folderDescription, setFolderDescription] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descriptionFile, setDescriptionFile] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const [selectedFolderParentId, setSelectedFolderParentId] = useState<number | null>(
    parentIdParam ? Number(parentIdParam) : null
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [orderBy, setOrderBy] = useState<string>("");
  const [orderDirection, setOrderDirection] = useState<string>("");
  const [fileName, setFileName] = useState<string>("")

  const handleSubmitFolder = async () => {
    try {
      setLoading(true);

      if (selectedNodeId) {

        await updateNodes(selectedNodeId, {
          name: folderName,
          description: folderDescription
        });

        setPage(1);
        setSearch("");

        await fetchData();

        setOpenFolderModal(false);
        setFolderName("");
        setFolderDescription("");
        setSelectedNodeId(null);

        return;
      }

      await createNodes({
        name: folderName,
        description: folderDescription,
        type: "FOLDER",
        parent_id: selectedFolderParentId,
      });

      setPage(1);
      setSearch("");

      await fetchData();

      setOpenFolderModal(false);
      setFolderName("");
      setFolderDescription("");
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async () => {
    try {
      if (!selectedFile) return;

      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "FILE");
      formData.append("description", descriptionFile);
      if (selectedFolderParentId) {
        formData.append("parent_id", selectedFolderParentId.toString());
      }

      await createNodes(formData);

      setPage(1);
      setSearch("");

      await fetchData();

      setOpenFileModal(false);
      setSelectedFile(null);
      setDescriptionFile("");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFile = async () => {
    try {
      if (!selectedNodeId) return;

      setLoading(true);

      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      formData.append("description", descriptionFile);

      await updateNodes(selectedNodeId, formData);

      setPage(1);
      setSearch("");

      await fetchData();

      setOpenFileModal(false);
      setSelectedFile(null);
      setDescriptionFile("");
      setSelectedNodeId(null);
    }
    catch (error) {
      console.error("Error updating file:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSaveFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFileName(""); // reset filename
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be under 10MB");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name); // ✅ store filename
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const nodesRespo = await fetchNodes(page, limit, search, selectedFolderParentId, orderBy, orderDirection);
      let data = nodesRespo.data;
      if (selectedFolderParentId) {
        data = [
          {
            id: -1,
            name: "...",
            type: "FOLDER",
            isBack: true,
          },
          ...data,
        ];
      };

      setNodes(data);
      setTotalPages(nodesRespo.meta.totalPages);

    } catch (error) {
      console.error("Error fetching nodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateData = async (id: number) => {
    try {
      setLoading(true);

      const node = await fetchNode(id);
      if (!node) return;

      setSelectedNodeId(id);

      if (node.type === "FOLDER") {
        // ✅ Folder update flow
        setFolderName(node.name || "");
        setFolderDescription(node.description || "");
        setOpenFolderModal(true);
        return;
      }

      if (node.type === "FILE") {
        // ✅ File update flow
        setDescriptionFile(node.description || "");
        setSelectedFile(null);
        setFileName(node.name || "")
        setOpenFileModal(true);
        return;
      }
    } catch (error) {
      console.error("Error fetching node details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async (id: number) => {
    try {
      setLoading(true);
      await deleteNode(id);

      setPage(1); // reset to first page
      setSearch(""); // reset search
      await fetchData();
    } catch (error) {
      console.error("Error deleting node:", error);
    } finally {
      setLoading(false);
    };
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedIds(ids);
  };

  const handleCancelFolderModal = () => {
    setOpenFolderModal(false);
    setFolderName("");
    setFolderDescription("");
    setSelectedNodeId(null);
  };

  const handleCancelFileModal = () => {
    setOpenFileModal(false);
    setSelectedFile(null);
    setDescriptionFile("");
    setSelectedNodeId(null);
    setFileName("");
  };

  const handleClickDetail = async (id: number) => {
    try {
      const detailData = nodes.find((node) => node.id === id);
      if (!detailData) return;

      if (detailData.isBack) {
        router.back()
        return;
      } else if (detailData.type === "FOLDER") {
        const params = new URLSearchParams(searchParams.toString());
        params.set("parent_id", id.toString());

        router.push(`${pathname}?${params.toString()}`);
      } else if (detailData.type === "FILE") {
        window.open(
          `${API_BASE_URL}v1/nodes/${id}/download`,
          "_blank",
          "noopener,noreferrer"
        );
      };
    } catch (error) {
      console.error("Error navigating to detail page:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = confirm(
      `Delete ${selectedIds.length} item(s)?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      await deleteNodes(selectedIds);

      fetchData(); // refresh table
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting selected items:", error);
    } finally {
      setLoading(false);
    }
  };

  const limitHandleChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // reset page
  };

  const handleSort = (key: string) => {
    const isSameColumn = orderBy === key;
    const nextDirection =
      isSameColumn
        ? orderDirection === "ASC"
          ? "DESC"
          : "ASC"
        : "DESC";

    setOrderBy(key);
    setOrderDirection(nextDirection);
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, selectedFolderParentId, orderDirection]);

  useEffect(() => {
    setSelectedFolderParentId(parentIdParam ? Number(parentIdParam) : null);
  }, [parentIdParam]);

  return (
    <div className="p-6">
      <HeadTitle
        title="Documents"
        rightSlot={
          <div className="flex flex-row gap-x-5">
            <Button label="Upload files" icon={<Upload size={16} />} className="border border-[#7272d5] bg-[#f9fafc]! text-[#2f2fc0]!" onClick={() => setOpenFileModal(true)} />
            <Button label="Add new folder" icon={<Plus size={16} />} className="bg-[#0908b6]! text-white" onClick={() => setOpenFolderModal(true)} />
          </div>
        }
      />

      {
        openFileModal && (
          <FileFormModal
            onCancel={handleCancelFileModal}
            onSubmit={selectedNodeId ? handleUpdateFile : handleCreateFile}
            file={selectedFile}
            description={descriptionFile}
            onFileChange={handleSaveFile}
            onDescriptionChange={(e) => setDescriptionFile(e)}
            loading={loading}
            fileName={fileName}
          />
        )
      }
      {
        openFolderModal && (
          <FolderFormModal
            onCancel={handleCancelFolderModal}
            name={folderName}
            description={folderDescription}
            onNameChange={setFolderName}
            onDescriptionChange={setFolderDescription}
            onSubmit={handleSubmitFolder}
            submitLabel={selectedNodeId ? "Update Folder" : "Create Folder"}
            title={selectedNodeId ? "Update Folder" : "Create New Folder"}
            loading={loading}
          />
        )
      }

      <div className="my-3 px-2">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="my-3 min-h-[40px] px-2">
        {selectedIds.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-2 py-1 text-md rounded bg-red-900 text-white hover:bg-red-800"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div>
        <Table
          columns={columns}
          data={nodes}
          onSelectionChange={handleSelectionChange}
          onPageChange={setPage}
          onLimitChange={limitHandleChange}
          page={page}
          limit={limit}
          totalPages={totalPages}
          handleUpdateData={handleUpdateData}
          handleDeleteData={handleDeleteData}
          loading={loading}
          handleClickDetail={handleClickDetail}
          onSortChange={handleSort}
          orderBy={orderBy}
          orderDirection={orderDirection}
        />
      </div>
    </div>
  );
}
