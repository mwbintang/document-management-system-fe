interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    date?: boolean;
}

interface TableItem {
    id: number;
    [key: string]: any;
}

export interface TableRowProps {
    item: TableItem;
    columns: TableColumn[];
    isSelected: boolean;
    onSelect: () => void;
    handleUpdateData?: (id: number) => void;
    handleDeleteData?: (id: number) => void;
}

export interface TableProps {
    columns: TableColumn[];
    data: TableItem[];
    onSelectionChange?: (selectedIds: number[]) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    page: number;
    limit: number;
    totalPages: number;
    handleUpdateData?: (id: number) => void;
    handleDeleteData?: (id: number) => void;
    loading: boolean;
}