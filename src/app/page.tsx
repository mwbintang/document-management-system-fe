"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { HeadTitle } from "../components/HeadTitle";
import { SearchBar } from "../components/SearchBar";
import { Table } from "../components/Table/Table";
import { Pagination } from "../components/Pagination";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { Plus, Upload } from "lucide-react";
import { createNodes, deleteNode, deleteNodes, fetchNode, fetchNodes, updateNodes } from "../services/nodes";
import { useDebounceFn } from "../lib/hooks/useDebounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FileFormModal } from "../components/Modal/FileFormModal";
import { FolderFormModal } from "../components/Modal/FolderFormModal";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "username", label: "Created by" },
  { key: "created_at", label: "Date", sortable: true, date: true },
  { key: "size", label: "Size" },
];

const data = [
  { id: "1", name: "Bintang", createdBy: "bintang@mail.com", date: "2023-01-01", size: "10MB" },
  { id: "2", name: "Jordy", createdBy: "jordy@mail.com", date: "2023-01-02", size: "15MB" },
  { id: "3", name: "Sarah", createdBy: "sarah@mail.com", date: "2023-01-03", size: "20MB" },
];


export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  const [nodes, setNodes] = useState<any[]>([]);
  // const [open, setOpen] = useState<boolean>(false);
  // const [name, setName] = useState<string>("");
  const [openFileModal, setOpenFileModal] = useState<boolean>(false);
  const [openFolderModal, setOpenFolderModal] = useState<boolean>(false);

  const [folderName, setFolderName] = useState<string>("");
  const [folderDescription, setFolderDescription] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descriptionFile, setDescriptionFile] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSubmitFolder = async () => {
    try {
      setLoading(true);

      if (selectedNodeId) {
        // Update existing folder logic can be added here
        await updateNodes(selectedNodeId, {
          name: folderName,
          description: folderDescription
        });

        setPage(1); // reset to first page
        setSearch(""); // reset search

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
        parent_id: selectedFolder
      });

      setPage(1); // reset to first page
      setSearch(""); // reset search

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
      formData.append("file", selectedFile); // must match multer field name
      formData.append("type", "FILE");
      formData.append("description", descriptionFile);
      if (selectedFolder) {
        formData.append("parent_id", selectedFolder);
      }

      await createNodes(formData);

      setPage(1); // reset to first page
      setSearch(""); // reset search

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
        formData.append("file", selectedFile); // must match multer field name
      }
      
      formData.append("description", descriptionFile);

      await updateNodes(selectedNodeId, formData);
      
      setPage(1); // reset to first page
      setSearch(""); // reset search

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
  }


  const handleSaveFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Optional validations
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be under 10MB");
      return;
    }

    // Optional type check
    // if (!file.type.startsWith("image/")) {
    //   alert("Only images allowed");
    //   return;
    // }

    setSelectedFile(file);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const nodesRespo = await fetchNodes(page, limit, search);
      setNodes(nodesRespo.data);
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
        setSelectedFile(null); // optional: keep null to mean "keep existing file"
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
  }

  const handleCancelFileModal = () => {
    setOpenFileModal(false);
    setSelectedFile(null);
    setDescriptionFile("");
    setSelectedNodeId(null);
  }


  // const handleApply = useDebounceFn(() => {
  //   const params = new URLSearchParams(searchParams.toString());

  //   params.set("search", search || "");
  //   params.set("page", "1"); // ✅ important: reset page on search

  //   router.push(`${pathname}?${params.toString()}`);
  // }, 1000);

  // const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(e.target.value);
  //   handleApply();
  // };

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
  }

  useEffect(() => {
    fetchData();
  }, [page, limit, search]);

  return (
    <div className="p-6">
      <HeadTitle
        title="Documents"
        rightSlot={
          <>
            <Button label="Upload files" icon={<Upload size={16} />} onClick={() => setOpenFileModal(true)} />
            <Button label="Add new folder" icon={<Plus size={16} />} onClick={() => setOpenFolderModal(true)} />
          </>
        }
      />

      {
        openFileModal && (
          <FileFormModal
            onCancel={handleCancelFileModal}
            onSubmit={selectedFile ? handleUpdateFile : handleCreateFile}
            file={selectedFile}
            description={descriptionFile}
            onFileChange={handleSaveFile}
            onDescriptionChange={(e) => setDescriptionFile(e)}
            loading={loading}
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

      <SearchBar value={search} onChange={setSearch} />

      {selectedIds.length > 0 && <button
        disabled={selectedIds.length === 0}
        onClick={handleDeleteSelected}
        className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
      >
        Delete Selected ({selectedIds.length})
      </button>}

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
      />
    </div>
  );
}
