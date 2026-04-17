import CommonTable from "../components/CommonTable";
import useFetchTransaction from "../hooks/useFetchTransaction";
import Loader from "../components/Loader";
import ErrorDisplay from "../components/ErrorDisplay";
import { deepFreeze } from "../utils/tableHelpers";
/**
 * Page component to display transactions and reward data
 * @component
 * @returns {JSX.Element} Rendered transactions page with table
 */
const TransactionsPage = () => {
  const { data, monthlyData, totalData, loading, error } = useFetchTransaction();

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay message={error.message} />;

  const tabs = deepFreeze([
    {
      label: "Monthly Rewards",
      type: "monthly",
      data: monthlyData,
      columns: [
        { field: "customerId", header: "Customer ID" },
        { field: "customerName", header: "Customer Name" },
        { field: "monthYear", header: "Month" },
        { field: "price", header: "Montly Amount Spent" },
        { field: "points", header: "Reward Points" },
      ],
    },
    {
      label: "Total Rewards",
      type: "total",
      data: totalData,
      columns: [
        { field: "customerId", header: "Customer ID" },
        { field: "customerName", header: "Customer Name" },
        { field: "price", header: "Amount Spent" },
        { field: "points", header: "Reward Points" },
      ],
    },
    {
      label: "Transactions",
      type: "transaction",
      data,
      columns: [
        { field: "transactionId", header: "Transaction ID" },
        { field: "customerId", header: "Customer ID" },
        { field: "customerName", header: "Customer Name" },
        { field: "date", header: "Purchase Date" },
        { field: "product", header: "Product" },
        { field: "price", header: "Price" },
        { field: "points", header: "Reward Points" },
      ],
    },
  ]);

  return <CommonTable tabs={tabs} />;
};

export default TransactionsPage;