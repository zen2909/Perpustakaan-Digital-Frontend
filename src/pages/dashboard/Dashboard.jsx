import StatCard from "../../components/dashboard/StatCard";
import TotalCard from "../../components/dashboard/TotalCard";
import Chart from "../../components/dashboard/Chart";
import { useState, useEffect } from "react";
import { monthlyfines as monthfines } from "../../services/loanService";
import { monthlyloans as monthloans } from "../../services/loanService";
export default function Dashboard() {
  const [finesdata, setFinesData] = useState([]);
  const [loansdata, setLoansData] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

  if (loading) return <p>Loading chart...</p>;

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <div className="">
          <StatCard type="members" />
        </div>
        <div className="">
          <StatCard type="books" />
        </div>
        <div className="">
          <StatCard type="authors" />
        </div>
        <div className="">
          <StatCard type="categories" />
        </div>
      </div>
      <div className="flex mt-2 gap-2">
        <TotalCard type="totalBookLoans" />
        <TotalCard type="activeLoans" />
        <TotalCard type="overdueLoans" />
        <TotalCard type="finesToday" />
        <TotalCard type="finesMonth" />
      </div>
      <div className="grid grid-rows-2 gap-16 mt-10">
        <Chart title="Monthly Fines" data={finesdata} />
        <Chart title="Monthly Loans" data={loansdata} />
      </div>
    </>
  );
}
