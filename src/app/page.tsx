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
import { createNodes, deleteNode, fetchNodes } from "../services/nodes";
import { useDebounceFn } from "../lib/hooks/useDebounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { UploadFileModal } from "../components/Modal/UploadFileModal";
import { CreateFolderModal } from "../components/Modal/CreateFolderModal";

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
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openFileModal, setOpenFileModal] = useState<boolean>(false);
  const [openFolderModal, setOpenFolderModal] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const [folderDescription, setFolderDescription] = useState<string>("");
  const [descriptionFile, setDescriptionFile] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSubmitFolder = async () => {
    try {
      setLoading(true);
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

  const handleSubmitFile = async () => {
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

  const handleUpdateData = async () => {
    console.log("Handle update data");
    // await fetchData();
  }

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

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };


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

      // await Promise.all(
      //   selectedIds.map((id) =>
      //     apiClient(`v1/nodes/${id}`, {
      //       method: "DELETE",
      //     })
      //   )
      // );

      setSelectedIds([]);
      fetchData(); // refresh table
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
          <UploadFileModal
            onCancel={() => setOpenFileModal(false)}
            onSubmit={handleSubmitFile}
            file={selectedFile}
            description={descriptionFile}
            onFileChange={handleSaveFile}
            onDescriptionChange={(e) => setDescriptionFile(e)}
          />
        )
      }
      {
        openFolderModal && (
          <CreateFolderModal
            onCancel={() => setOpenFolderModal(false)}
            name={folderName}
            description={folderDescription}
            onNameChange={setFolderName}
            onDescriptionChange={setFolderDescription}
            onSubmit={handleSubmitFolder}
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
      />
    </div>
  );
}
