interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
}

interface TableItem {
    id: string;
    [key: string]: any;
}

export interface TableRowProps {
  item: TableItem;
  columns: TableColumn[];
  isSelected: boolean;
  onSelect: () => void;
}

export interface TableProps {
    columns: TableColumn[];
    data: TableItem[];
    onSelectionChange?: (selectedIds: string[]) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}