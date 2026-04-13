import StatCard from "../../components/dashboard/StatCard";
import TotalCard from "../../components/dashboard/TotalCard";
import Chart from "../../components/dashboard/Chart";
import { useState, useEffect, useCallback } from "react";
import { monthlyfines as monthfines } from "../../services/loanService";
import { monthlyloans as monthloans } from "../../services/loanService";
import { getMembers } from "../../services/authService";
import { getBooks } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import { getAuthors } from "../../services/authorService";
import {
  getTotalLoans,
  getTotalActiveLoans,
  getTotalOverdueLoans,
  getTotalFinesMonth,
  getTotalFinesToday,
} from "../../services/loanService";
export default function Dashboard() {
  const [finesdata, setFinesData] = useState([]);
  const [loansdata, setLoansData] = useState([]);
  const [members, setMembers] = useState(0);
  const [books, setBooks] = useState(0);
  const [authors, setAuthors] = useState(0);
  const [categories, setCategories] = useState(0);
  const [totalloans, setTotalLoans] = useState(0);
  const [totalactiveloans, setTotalActiveLoans] = useState(0);
  const [totaloverdueloans, setTotalOverdueLoans] = useState(0);
  const [totalfinesmonth, setTotalFinesMonth] = useState(0);
  const [totalfines, setTotalFines] = useState(0);
  const [loading, setLoading] = useState(true);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchDataMembers = useCallback(async () => {
    const response = await getMembers();
    setMembers(response.data.data.length);
  });

  const fetchDataBooks = useCallback(async () => {
    const response = await getBooks();
    setBooks(response.data.data.length);
  });
  const fetchDataCategories = useCallback(async () => {
    const response = await getCategories();
    setCategories(response.data.data.length);
  });
  const fetchDataAuthors = useCallback(async () => {
    const response = await getAuthors();
    setAuthors(response.data.data.length);
  });

  const fetchTotalLoans = useCallback(async () => {
    const response = await getTotalLoans();
    setTotalLoans(response.data.data.length);
  });
  const fetchActiveLoans = useCallback(async () => {
    const response = await getTotalActiveLoans();
    setTotalActiveLoans(response.data.data.length);
  });
  const fetchOverdueLoans = useCallback(async () => {
    const response = await getTotalOverdueLoans();
    setTotalOverdueLoans(response.data.data.length);
  });
  const fetchFinesToday = useCallback(async () => {
    const response = await getTotalFinesToday();
    setTotalFines(response.data.data.length);
  });
  const fetchFinesMonth = useCallback(async () => {
    const response = await getTotalFinesMonth();
    setTotalFinesMonth(response.data.data.length);
  });
  const fetchDataChart = useCallback(async () => {
    const fines = await monthfines();
    const loans = await monthloans();

    const formattedfines = fines.data.map((value, index) => ({
      month: months[index],
      value: value,
    }));
    const formattedloans = loans.data.map((value, index) => ({
      month: months[index],
      value: value,
    }));

    setFinesData(formattedfines);
    setLoansData(formattedloans);
    setLoading(false);
  });

  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        fetchDataChart(),
        fetchDataMembers(),
        fetchDataBooks(),
        fetchDataCategories(),
        fetchDataAuthors(),
        fetchTotalLoans(),
        fetchActiveLoans(),
        fetchOverdueLoans(),
        fetchFinesToday(),
        fetchFinesMonth(),
      ]);
    } catch (error) {
      console.error(error);
    }
  }, [
    fetchDataChart,
    fetchDataMembers,
    fetchDataBooks,
    fetchDataCategories,
    fetchDataAuthors,
    fetchTotalLoans,
    fetchActiveLoans,
    fetchOverdueLoans,
    fetchFinesToday,
    fetchFinesMonth,
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <StatCard type="members" value={members} />

        <StatCard type="books" value={books} />

        <StatCard type="authors" value={authors} />

        <StatCard type="categories" value={categories} />
      </div>
      <div className="flex mt-4 gap-2">
        <TotalCard type="totalBookLoans" value={totalloans} />
        <TotalCard type="activeLoans" value={totalactiveloans} />
        <TotalCard type="overdueLoans" value={totaloverdueloans} />
        <TotalCard type="finesToday" value={totalfines} />
        <TotalCard type="finesMonth" value={totalfinesmonth} />
      </div>
      <div className="grid grid-rows-2 gap-5 mt-8">
        {loading ? (
          <>
            <div className="w-full h-64 bg-sky-50 rounded-lg animate-pulse flex items-center justify-center">
              <span className="loading loading-spinner text-blue-400"></span>
            </div>
            <div className="w-full h-64 bg-sky-50 rounded-lg animate-pulse flex items-center justify-center">
              <span className="loading loading-spinner text-blue-400"></span>
            </div>
          </>
        ) : (
          <>
            <Chart title="Monthly Fines" data={finesdata} />
            <Chart title="Monthly Loans" data={loansdata} />
          </>
        )}
      </div>
    </>
  );
}
