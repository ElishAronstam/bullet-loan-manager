import type { Payment } from "../graphql/generated/types";
import DataTable, { type Column } from "./DataTable/DataTable";
import InfiniteScroll from "./InfiniteScroll/InfiniteScroll";
import { useClientLoadMore } from "../hooks/useLoadMore";

const PAGE_SIZE = 15;

const columns: Column<Payment>[] = [
  { header: "Date", value: (payment: Payment) => payment.paymentDate },
  { header: "Type", value: (payment: Payment) => payment.paymentType },
  {
    header: "Principal",
    value: (payment: Payment) => `$${payment.principal.toLocaleString()}`,
  },
  {
    header: "Interest",
    value: (payment: Payment) => `$${payment.interest.toLocaleString()}`,
  },
  {
    header: "Total",
    value: (payment: Payment) => `$${payment.total.toLocaleString()}`,
  },
  {
    header: "Remaining Balance",
    value: (payment: Payment) =>
      `$${payment.remainingBalance.toLocaleString()}`,
  },
];

interface RepaymentTableProps {
  payments: Payment[];
}

const RepaymentTable = ({ payments }: RepaymentTableProps) => {
  const { visibleCount, loading, hasMore, loadMore } = useClientLoadMore(
    payments.length,
    PAGE_SIZE,
  );
  const visiblePayments = payments.slice(0, visibleCount);

  return (
    <InfiniteScroll hasMore={hasMore} loading={loading} onLoadMore={loadMore}>
      <DataTable
        columns={columns}
        data={visiblePayments}
        rowKey={(payment) => payment.id}
      />
    </InfiniteScroll>
  );
};

export default RepaymentTable;
