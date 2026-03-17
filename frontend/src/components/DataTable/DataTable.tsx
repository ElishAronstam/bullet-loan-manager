import { SortOrder } from "../../graphql/generated/types";
import {
  Row,
  Table,
  TableData,
  TableHeader,
  SortIndicator,
} from "./DataTable.styles";

export type Column<T> = {
  header: string;
  sortKey?: string;
  value: (row: T) => string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  onSort?: (sortKey: string) => void;
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => (
            <TableHeader
              key={column.header}
              $sortable={!!column.sortKey}
              onClick={() => column.sortKey && onSort?.(column.sortKey)}
            >
              {column.header}
              {column.sortKey && sortBy === column.sortKey && (
                <SortIndicator>
                  {sortOrder === SortOrder.ASC ? "▲" : "▼"}
                </SortIndicator>
              )}
            </TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <Row
            key={rowKey(item)}
            onClick={() => onRowClick?.(item)}
            isClickable={!!onRowClick}
          >
            {columns.map((column) => (
              <TableData key={column.header}>{column.value(item)}</TableData>
            ))}
          </Row>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;
