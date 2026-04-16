import React, { useState, useMemo } from "react";
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

/**
 * Reusable tabbed table component
 * @param {Array<Object>} tabs - tab configs
 */
const CommonTable = ({ tabs }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selectedMonth, setSelectedMonth] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const activeTab = tabs?.[tabIndex] || { data: [], columns: [] };
  const isTransactionTab = activeTab.type === "transaction";
  const isMonthlyTab = activeTab.type === "monthly";

  const defaultTo = dayjs().format("YYYY-MM-DD");
  const defaultFrom = dayjs().subtract(2, "month").startOf("month").format("YYYY-MM-DD");

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [tempFrom, setTempFrom] = useState(fromDate);
  const [tempTo, setTempTo] = useState(toDate);
  const filteredData = useMemo(() => {
    const source = Array.isArray(activeTab.data) ? activeTab.data : [];

    let result = source;

    if (debouncedSearch) {
      const searchWords = debouncedSearch.trim().toLowerCase().split(/\s+/);

      result = result.filter((item) => {
        const itemValues = Object.values(item).map((v) =>
          String(v).toLowerCase()
        );

        return searchWords.every((word) =>
          itemValues.some((val) => val.includes(word))
        );
      });
    }

    if (isTransactionTab && (fromDate || toDate)) {
      result = result.filter((item) => {
        if (!item.date) return false;

        const itemDate = dayjs(item.date); 

        const from = fromDate
          ? dayjs(fromDate, "MM/DD/YYYY").startOf("day")
          : null;

        const to = toDate
          ? dayjs(toDate, "MM/DD/YYYY").endOf("day")
          : null;

        if (from && itemDate.isBefore(from)) return false;
        if (to && itemDate.isAfter(to)) return false;

        return true;
      });
    }


    if (isMonthlyTab && selectedMonth) {
      result = result.filter((item) => {
        if (!item.year || !item.month) return false;

        const [year, month] = selectedMonth.split("-");

        return (
          String(item.year) === year &&
          String(item.month).padStart(2, "0") === month
        );
      });
    }

    return result;
  }, [
    activeTab.data,
    debouncedSearch,
    fromDate,
    toDate,
    selectedMonth,
    isTransactionTab,
    isMonthlyTab,
  ]);

  const paginatedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a?.[orderBy];
      const bVal = b?.[orderBy];

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrder("asc");
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 1, px: 1 }}>
      <Card sx={{ mb: 1, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <EmojiEventsIcon color="primary" />
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#4b81b8"
            sx={{ position: "relative", top: 3 }}
          >
            Rewards Dashboard
          </Typography>
        </CardContent>
      </Card>

      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, v) => {
            setTabIndex(v);

            setSearch("");
            setPage(0);

            setTempFrom("");
            setTempTo("");
            setFromDate("");
            setToDate("");

            setSelectedMonth("");
          }}
        >
          {tabs.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>

        <TableSearch
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          label={activeTab.label}
        />
        {isTransactionTab && (
          <TableDateFilter
            fromDate={tempFrom}
            toDate={tempTo}
            onFromDateChange={setTempFrom}
            onToDateChange={setTempTo}
            onApply={() => {
              setFromDate(tempFrom);
              setToDate(tempTo);
              setPage(0);
            }}
            onClear={() => {
              setTempFrom("");
              setTempTo("");
              setFromDate("");
              setToDate("");
              setPage(0);
            }}
          />
        )}


        {isMonthlyTab && (
          <TableMonthFilter
            value={selectedMonth}
            handleMonthChange={(value) => {
              setSelectedMonth(value);
              setPage(0);
            }}
            handleClear={() => {
              setSelectedMonth("");
              setPage(0);
            }}
          />
        )}
        <TableContainer sx={{ maxHeight: 1000, overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHeader
              columns={activeTab.columns}
              order={order}
              orderBy={orderBy}
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
          count={filteredData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
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