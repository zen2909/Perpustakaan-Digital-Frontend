import { useEffect, useState } from "react";
import {
  getAllLoans,
  deleteLoan,
  approveLoan,
} from "../../services/loanService";
import TableData from "../../components/table/TableData";
import ButtonUi from "../../components/ui/ButtonUi";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [buttonData, setButtonData] = useState([]);

  const loansColumn = [
    { key: "index", type: "text", label: "No" },
    { key: "book", type: "text", label: "Book" },
    { key: "member", type: "text", label: "Member" },
    { key: "loandate", type: "text", label: "Loan Date" },
    { key: "status", type: "text", label: "Status" },
    { key: "finestatus", type: "text", label: "Fine Status" },
  ];

  const fetchLoans = async () => {
    try {
      const response = await getAllLoans();
      setLoans(response.data.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleButton = async () => {
    
  };

  return (
    <div className="p-6">
      <TableData
        data={loansColumn}
        values={loans}
        // buttons={buttonData}
        // loading={loading}
      />
    </div>
  );
}
