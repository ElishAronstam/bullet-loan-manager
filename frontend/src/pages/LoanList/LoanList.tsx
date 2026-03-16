import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_LOANS } from "../../graphql/queries";
import { Container, NewLoanButton, SearchInput } from "./LoanList.styles";
import PageHeader from "../../components/PageHeader/PageHeader";
import NewLoanModal from "../../components/NewLoanModal/NewLoanModal";
import DataTable from "../../components/DataTable/DataTable";
import QueryState from "../../components/QueryState";
import InfiniteScroll from "../../components/InfiniteScroll";
import { useServerLoadMore } from "../../hooks/useLoadMore";
import { SortOrder } from "../../graphql/generated/types";
import type { Loan, GetLoansQuery } from "../../graphql/generated/types";

const PAGE_SIZE = 2;
type LoanSummary = Pick<
  Loan,
  "id" | "name" | "principal" | "startDate" | "totalInterest"
>;

export type Column<T> = {
  header: string;
  sortKey?: string;
  value: (row: T) => string;
};

const columns: Column<LoanSummary>[] = [
  { header: "Name", sortKey: "name", value: (loan: LoanSummary) => loan.name },
  {
    header: "Principal",
    sortKey: "principal",
    value: (loan: LoanSummary) => `$${loan.principal.toLocaleString()}`,
  },
  {
    header: "Start Date",
    sortKey: "startDate",
    value: (loan: LoanSummary) => loan.startDate,
  },
  {
    header: "Total Interest",
    sortKey: "totalInterest",
    value: (loan: LoanSummary) => `$${loan.totalInterest.toLocaleString()}`,
  },
];

const LoanList = () => {
  const [allLoans, setAllLoans] = useState<LoanSummary[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const navigate = useNavigate();

  const { page, loadMore, reset } = useServerLoadMore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data, loading, error } = useQuery<GetLoansQuery>(GET_LOANS, {
    variables: {
      page,
      pageSize: PAGE_SIZE,
      searchText: debouncedSearch,
      sortBy,
      sortOrder,
    },
  });

  const totalCount = data?.loans.loansCount ?? 0;
  const hasMore = allLoans.length < totalCount;

  useEffect(() => {
    setAllLoans([]);
    reset();
  }, [debouncedSearch, sortBy, sortOrder, reset]);

  useEffect(() => {
    if (data?.loans.loans) {
      setAllLoans((prev) => {
        const startIndex = (page - 1) * PAGE_SIZE;
        const updated = [...prev];
        data.loans.loans.forEach((loan, index) => {
          updated[startIndex + index] = loan;
        });
        return updated;
      });
    }
  }, [data, page]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) =>
        prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
      );
    } else {
      setSortBy(key);
      setSortOrder(SortOrder.ASC);
    }
  };

  return (
    <Container>
      <PageHeader
        title="Sherman Loans"
        subtitle="Manage your bullet loan portfolio"
        action={
          <NewLoanButton onClick={() => setIsModalOpen(true)}>
            + New Loan
          </NewLoanButton>
        }
      />

      <SearchInput
        type="text"
        placeholder="Search loans by name..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <QueryState
        loading={loading && page === 1}
        error={error}
        empty={allLoans.length === 0 && !loading}
        emptyMessage="No loans found:( , Create one to get started."
      >
        <InfiniteScroll
          hasMore={hasMore}
          loading={loading && page > 1}
          onLoadMore={loadMore}
        >
          <DataTable
            columns={columns}
            data={allLoans}
            rowKey={(loan) => loan.id}
            onRowClick={(loan) => navigate(`/loan/${loan.id}`)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </InfiniteScroll>
      </QueryState>

      <NewLoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default LoanList;
