"use client";

import { useState } from "react";
import { Button } from "../components/Button";
import { HeadTitle } from "../components/HeadTitle";
import { SearchBar } from "../components/SearchBar";
import { Table } from "../components/Table/Table";
import { Pagination } from "../components/Pagination";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { Plus, Upload } from "lucide-react";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "createdBy", label: "Created by" },
  { key: "date", label: "Date", sortable: true },
  { key: "size", label: "Size" },
];

const data = [
  { id: "1", name: "Bintang", createdBy: "bintang@mail.com", date: "2023-01-01", size: "10MB" },
  { id: "2", name: "Jordy", createdBy: "jordy@mail.com", date: "2023-01-02", size: "15MB" },
  { id: "3", name: "Sarah", createdBy: "sarah@mail.com", date: "2023-01-03", size: "20MB" },
];


export default function Page() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setName("");
    }, 2000);
  };

  return (
    <div className="p-6">
      <HeadTitle
        title="Documents"
        rightSlot={
          <>
            <Button label="Upload files" icon={<Upload size={16} />} />
            <Button label="Add new folder" icon={<Plus size={16} />} />
          </>
        }
      />

      <SearchBar value={search} onChange={setSearch} />

      <Table
        columns={columns}
        data={data}
        onSelectionChange={(ids: string[]) =>
          console.log("Selected IDs:", ids)
        }
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}
