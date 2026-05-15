// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import StatsCard from "../../components/dashboard/StatCard";
import ChartSection from "../../components/dashboard/Chart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import PendingLoansTable from "../../components/dashboard/PendingLoansTable";
import {
  getTotalLoans,
  getTotalActiveLoans,
  getTotalOverdueLoans,
  getTotalFinesToday,
  getTotalFinesMonth,
  getAllLoans,
  monthlyloans,
  monthlyfines,
} from "../../services/loanService";
import { getTotalBooks } from "../../services/bookService";
import { getTotalUsers } from "../../services/authService";
import { getNewUsersToday } from "../../services/authService";
import { getBooksMonthlyGrowth } from "../../services/bookService";
import SkeletonLoading from "../../components/ui/SkeletonLoading";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalLoans: 0,
    totalFines: 0,
  });
  const [loanStats, setLoanStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    finesToday: 0,
    finesMonth: 0,
  });
  const [monthlyLoansData, setMonthlyLoansData] = useState([]);
  const [monthlyFinesData, setMonthlyFinesData] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [booksGrowth, setBooksGrowth] = useState("+0%");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          getTotalLoans(),
          getTotalActiveLoans(),
          getTotalOverdueLoans(),
          getTotalFinesToday(),
          getTotalFinesMonth(),
          getAllLoans(),
          monthlyloans(),
          monthlyfines(),
          getTotalBooks(),
          getTotalUsers(),
          getNewUsersToday(),
          getBooksMonthlyGrowth(),
        ]);

        const getValue = (res, def = 0) => {
          if (res.status === "fulfilled" && res.value?.data) {
            const d = res.value.data;
            if (typeof d === "number") return d;
            if (typeof d === "object" && d !== null && d.total !== undefined)
              return d.total;
            return def;
          }
          return def;
        };

        const getArray = (res, def = []) => {
          if (res.status === "fulfilled" && Array.isArray(res.value?.data))
            return res.value.data;
          return def;
        };

        const totalLoans = getValue(results[0]);
        const activeLoans = getValue(results[1]);
        const overdueLoans = getValue(results[2]);
        const finesToday = getValue(results[3]);
        const finesMonth = getValue(results[4]);
        const allLoans = getArray(results[5]);
        const monthlyLoansRaw = getArray(results[6]);
        const monthlyFinesRaw = getArray(results[7]);
        const totalBooks = getValue(results[8]);
        const totalUsers = getValue(results[9]);
        const newUsers =
          results[10].status === "fulfilled"
            ? results[10].value.data?.newUsers || 0
            : 0;
        const growth =
          results[11].status === "fulfilled"
            ? results[11].value.data?.growth || 0
            : 0;

        setNewUsersToday(newUsers);
        setBooksGrowth(growth);

        setLoanStats({
          totalLoans,
          activeLoans,
          overdueLoans,
          finesToday,
          finesMonth,
        });
        setStats({
          totalBooks,
          totalUsers,
          totalLoans,
          totalFines: finesMonth,
        });
        setMonthlyLoansData(monthlyLoansRaw);
        setMonthlyFinesData(monthlyFinesRaw);
        setPendingLoans(
          allLoans.filter(
            (l) => l.status === "pending" || l.status === "approved",
          ),
        );
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <SkeletonLoading type="dashboard" />;
  if (error)
    return (
      <div className="p-4 md:p-8 flex justify-center items-center">
        <div className="text-error bg-error-container p-4 rounded-lg">
          {error}
        </div>
      </div>
    );

  const statsCards = [
    {
      icon: "library_books",
      label: "Total Books",
      value: stats.totalBooks.toLocaleString(),
      subText: booksGrowth,
      subTextColor: "primary",
    },
    {
      icon: "group",
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      subText: `+${newUsersToday} today`,
      subTextColor: "primary",
    },
    {
      icon: "book_loader",
      label: "Total Loans",
      value: loanStats.totalLoans.toLocaleString(),
      subText: `${loanStats.overdueLoans} late`,
      subTextColor: "error",
    },
    {
      icon: "payments",
      label: "Total Fines",
      value: `Rp ${loanStats.finesMonth.toLocaleString("id-ID")}`,
      subText: "This month",
      subTextColor: "on-surface-variant",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-primary">
            Library Overview
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time insights for NusantaraReads administrative system.
          </p>
        </div>

        {/* Stats Cards - sudah responsif dengan grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statsCards.map((s, i) => (
            <StatsCard key={i} {...s} />
          ))}
        </div>

        {/* Chart & Recent Activity - stack di mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <ChartSection
              monthlyLoans={monthlyLoansData}
              monthlyFines={monthlyFinesData}
            />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Pending Loans Table - dengan overflow scroll horizontal untuk mobile */}
        <div className="mt-6 md:mt-8 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <div className="min-w-[640px] md:min-w-0">
            <PendingLoansTable loans={pendingLoans} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
