import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Table,
  TableContainer,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import useDebounce from "../hooks/useDebounce";
import TableHeader from "./table/TableHeader";
import TableBodyComponent from "./table/TableBodyComponent";
import TableSearch from "./table/TableSearch";
import TablePaginationComponent from "./table/TablePaginationComponent";
import PropTypes from "prop-types";
import TableDateFilter from "./table/TableDateFilter";
import TableMonthFilter from "./table/TableMonthFilter";
import dayjs from "dayjs";

const CommonTable = ({ tabs }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const [tableState, setTableState] = useState({
    search: "",
    page: 0,
    order: "asc",
    orderBy: "id",
    selectedMonth: "",
    dateRange: {
      from: "",
      to: "",
    },
    draftDateRange: {
      from: dayjs().subtract(2, "month").startOf("month").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    }
  });

  const debouncedSearch = useDebounce(tableState.search, 300);

  const activeTab = tabs?.[tabIndex] || { data: [], columns: [] };
  const isTransactionTab = activeTab.type === "transaction";
  const isMonthlyTab = activeTab.type === "monthly";
  
  //  Reset on tab change
  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      search: "",
      page: 0,
      selectedMonth: "",
      dateRange: { from: "", to: "" },
    }));
  }, [tabIndex]);

  // Filtering
  const filteredData = useMemo(() => {
    let result = Array.isArray(activeTab.data) ? activeTab.data : [];

    if (debouncedSearch) {
      const words = debouncedSearch.trim().toLowerCase().split(/\s+/);

      result = result.filter((item) =>
        words.every((word) =>
          [
            item.customerId,
            item.customerName,
            item.transactionId,
            item.product,
          ]
            .map((v) => String(v || "").toLowerCase())
            .some((val) => val.includes(word))
        )
      );
    }

    // Date filter
    if (isTransactionTab && (tableState.dateRange.from || tableState.dateRange.to)) {
      result = result.filter((item) => {
        if (!item.date) return false;

        const itemDate = dayjs(item.date);

        const from = tableState.dateRange.from
          ? dayjs(tableState.dateRange.from).startOf("day")
          : null;

        const to = tableState.dateRange.to
          ? dayjs(tableState.dateRange.to).endOf("day")
          : null;

        if (from && itemDate.isBefore(from)) return false;
        if (to && itemDate.isAfter(to)) return false;

        return true;
      });
    }

    // Monthly filter
    if (isMonthlyTab && tableState.selectedMonth) {
      const [year, month] = tableState.selectedMonth.split("-");

      result = result.filter(
        (item) =>
          String(item.year) === year &&
          String(item.month).padStart(2, "0") === month
      );
    }

    return result;
  }, [activeTab.data, debouncedSearch, tableState, isTransactionTab, isMonthlyTab]);

  // Grouping
  const groupedData = useMemo(() => {
    if (!isMonthlyTab) return filteredData;

    const map = {};
    filteredData.forEach((item) => {
      if (!map[item.customerId]) map[item.customerId] = [];
      map[item.customerId].push(item);
    });

    return Object.values(map);
  }, [filteredData, isMonthlyTab]);
  
  // Pagination (fixed size)
  const paginatedData = useMemo(() => {
    const PAGE_SIZE = isMonthlyTab ? 5 : 5;
    if (!isMonthlyTab) {
      const sorted = [...filteredData].sort((a, b) => {
        const aVal = a?.[tableState.orderBy];
        const bVal = b?.[tableState.orderBy];

        if (aVal < bVal) return tableState.order === "asc" ? -1 : 1;
        if (aVal > bVal) return tableState.order === "asc" ? 1 : -1;
        return 0;
      });

      return sorted.slice(
        tableState.page * PAGE_SIZE,
        tableState.page * PAGE_SIZE + PAGE_SIZE
      );
    }

    return groupedData.slice(
      tableState.page * PAGE_SIZE,
      tableState.page * PAGE_SIZE + PAGE_SIZE
    );
  }, [filteredData, groupedData, tableState, isMonthlyTab]);

  // Sort handler
  const handleSort = useCallback((field) => {
    setTableState((prev) => ({
      ...prev,
      orderBy: field,
      order: prev.orderBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  }, []);

  return (
    <Container maxWidth={false} sx={{ mt: 2, px: 2 }}>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h6" fontWeight="bold" color="#4b81b8">
            Rewards Dashboard
          </Typography>
        </CardContent>
      </Card>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
          {tabs.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>

        <TableSearch
          value={tableState.search}
          onChange={(e) =>
            setTableState((p) => ({ ...p, search: e.target.value, page: 0 }))
          }
          label={activeTab.label}
        />

        {isTransactionTab && (
          <TableDateFilter
            fromDate={tableState.draftDateRange.from}
            toDate={tableState.draftDateRange.to}
            onFromDateChange={(v) =>
              setTableState((p) => ({
                ...p,
                draftDateRange: { ...p.draftDateRange, from: v },
              }))
            }
            onToDateChange={(v) =>
              setTableState((p) => ({
                ...p,
                draftDateRange: { ...p.draftDateRange, to: v },
              }))
            }
            onApply={() =>
              setTableState((p) => ({
                ...p,
                dateRange: { ...p.draftDateRange },
                page: 0,
              }))
            }
            onClear={() =>
              setTableState((p) => ({
                ...p,
                draftDateRange: { from: "", to: "" },
                dateRange: { from: "", to: "" },
                page: 0,
              }))
            }
          />
        )}

        {isMonthlyTab && (
          <TableMonthFilter
            value={tableState.selectedMonth}
            handleMonthChange={(value) =>
              setTableState((p) => ({ ...p, selectedMonth: value, page: 0 }))
            }
            handleClear={() =>
              setTableState((p) => ({ ...p, selectedMonth: "", page: 0 }))
            }
          />
        )}

        <TableContainer>
          <Table stickyHeader>
            <TableHeader
              columns={activeTab.columns}
              order={tableState.order}
              orderBy={tableState.orderBy}
              onSort={handleSort}
            />
            <TableBodyComponent
              data={paginatedData}
              columns={activeTab.columns}
              type={activeTab.type}
            />
          </Table>
        </TableContainer>

        <TablePaginationComponent
          count={isMonthlyTab ? groupedData.length : filteredData.length}
          page={tableState.page}
          rowsPerPage={isMonthlyTab ? 5 : 5}
          onPageChange={(_, p) =>
            setTableState((prev) => ({ ...prev, page: p }))
          }
        />
      </Paper>
    </Container>
  );
};
CommonTable.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string.isRequired,
          header: PropTypes.string.isRequired,
          hideOnMobile: PropTypes.bool,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default CommonTable;