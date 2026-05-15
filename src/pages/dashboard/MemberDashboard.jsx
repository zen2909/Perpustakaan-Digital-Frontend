// src/pages/member/MemberDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { getMemberloans } from "../../services/loanService";
import { getBooks, getBookcoverUrl } from "../../services/bookService";
import MemberStatsSection from "../../components/dashboard/MemberStatsSection";
import DiscoverySection from "../../components/dashboard/DiscoverySection";
import RecommendedBooks from "../../components/dashboard/RecommendedBooks";
import SkeletonLoading from "../../components/ui/SkeletonLoading";

const MemberDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeLoans: 0,
    pendingDues: 0,
    dueDate: "-",
  });
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // 1. Ambil data peminjaman member
        const loansRes = await getMemberloans();
        const loans = loansRes.data?.data || loansRes.data || [];

        // Hitung active loans (status borrowed atau overdue)
        const activeLoans = loans.filter(
          (loan) => loan.status === "borrowed" || loan.status === "overdue",
        ).length;

        // Hitung pending dues (fine_amount dari loan yang overdue)
        const pendingDues = loans
          .filter((loan) => loan.status === "overdue" && loan.fine_amount > 0)
          .reduce((sum, loan) => sum + (loan.fine_amount || 0), 0);

        // Cari due date terdekat dari loan yang active (borrowed)
        const activeBorrowed = loans.filter(
          (loan) => loan.status === "borrowed",
        );
        let nearestDue = "-";
        if (activeBorrowed.length > 0) {
          const today = new Date();
          const nearest = activeBorrowed.reduce((prev, curr) => {
            const dueDate = new Date(curr.due_date);
            return dueDate < prev ? dueDate : prev;
          }, new Date(activeBorrowed[0].due_date));
          const diffDays = Math.ceil((nearest - today) / (1000 * 60 * 60 * 24));
          nearestDue = `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
        }

        setStats({
          activeLoans,
          pendingDues,
          dueDate: nearestDue,
        });

        // 2. Ambil rekomendasi buku (misal 4 buku terbaru)
        const booksRes = await getBooks({
          per_page: 4,
          sort_by: "created_at",
          sort_order: "desc",
        });
        const books = booksRes.data?.data || booksRes.data || [];

        const formattedBooks = books.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author?.name || "Unknown Author",
          // Tentukan status berdasarkan stok (sederhana)
          status: book.stock > 0 ? "available" : "borrowed",
          coverImage: getBookcoverUrl(book.cover_image),
        }));
        setRecommendedBooks(formattedBooks);
      } catch (error) {
        console.error("Error fetching member dashboard:", error);
        // Fallback data dummy agar tidak kosong
        setStats({
          activeLoans: 0,
          pendingDues: 0,
          dueDate: "3 days",
        });
        setRecommendedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleSettleNow = () => {
    // TODO: Navigasi ke halaman pembayaran denda
    console.log("Settle now clicked");
  };

  const handleExplore = () => {
    // TODO: Navigasi ke halaman katalog
    console.log("Explore clicked");
  };

  const handleViewAll = () => {
    // TODO: Navigasi ke halaman katalog
    console.log("View all books clicked");
  };

  if (loading) return <SkeletonLoading type="memberDashboard" />;

  return (
    <div className="space-y-12">
      <MemberStatsSection
        activeLoans={stats.activeLoans}
        pendingDues={stats.pendingDues}
        dueDate={stats.dueDate}
        onSettleNow={handleSettleNow}
      />
      <DiscoverySection onExplore={handleExplore} />
      <RecommendedBooks books={recommendedBooks} onViewAll={handleViewAll} />
    </div>
  );
};

export default MemberDashboardPage;
