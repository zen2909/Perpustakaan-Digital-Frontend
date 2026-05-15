// src/components/ui/SkeletonLoading.jsx
import React from "react";

// Komponen dasar skeleton dengan animasi pulse
const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-surface-container-high rounded ${className}`}
    ></div>
  );
};

// Skeleton untuk teks
export const SkeletonText = ({
  width = "w-full",
  height = "h-4",
  className = "",
}) => {
  return <Skeleton className={`${width} ${height} ${className}`} />;
};

// Skeleton untuk stat card
export const SkeletonCard = () => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <SkeletonText width="w-24" height="h-3" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <SkeletonText width="w-16" height="h-8" className="mb-2" />
      <SkeletonText width="w-32" height="h-3" />
    </div>
  );
};

// Skeleton untuk grid statistik
export const SkeletonStatsGrid = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array(count)
        .fill()
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  );
};

// Skeleton untuk baris tabel
export const SkeletonTableRow = ({ cols = 6 }) => {
  return (
    <tr className="border-t border-surface-container-low">
      {Array(cols)
        .fill()
        .map((_, i) => (
          <td key={i} className="px-8 py-5">
            <SkeletonText width="w-full" height="h-4" />
          </td>
        ))}
    </tr>
  );
};

// Skeleton untuk tabel lengkap
export const SkeletonTable = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
      <div className="px-8 py-4 bg-surface-container-low/50">
        <SkeletonText width="w-32" height="h-5" />
      </div>
      <table className="w-full">
        <thead className="bg-surface-container-low">
          <tr>
            {Array(cols)
              .fill()
              .map((_, i) => (
                <th key={i} className="px-8 py-4">
                  <SkeletonText width="w-20" height="h-3" />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows)
            .fill()
            .map((_, i) => (
              <SkeletonTableRow key={i} cols={cols} />
            ))}
        </tbody>
      </table>
      <div className="px-8 py-4 flex justify-between items-center">
        <SkeletonText width="w-40" height="h-4" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};

// Skeleton untuk filter bar
export const SkeletonFilterBar = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 px-2">
      {Array(5)
        .fill()
        .map((_, i) => (
          <Skeleton key={i} className="w-24 h-8 rounded-full" />
        ))}
      <div className="ml-auto flex gap-2">
        <Skeleton className="w-16 h-8 rounded" />
        <Skeleton className="w-24 h-8 rounded" />
      </div>
    </div>
  );
};

// ================= SKELETON KHUSUS DASHBOARD =================
export const DashboardPageSkeleton = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <SkeletonText width="w-48" height="h-8" className="mb-2" />
        <SkeletonText width="w-64" height="h-4" />
      </div>
      <SkeletonStatsGrid count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest p-8 rounded-xl h-80 animate-pulse"></div>
        </div>
        <div>
          <div className="bg-surface-container-lowest p-8 rounded-xl h-80 animate-pulse"></div>
        </div>
      </div>
      <div className="mt-8">
        <div className="bg-surface-container-lowest rounded-xl h-96 animate-pulse"></div>
      </div>
    </div>
  );
};

// ================= SKELETON KHUSUS BOOKS =================
export const BooksPageSkeleton = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <SkeletonText width="w-24" height="h-3" className="mb-2" />
          <SkeletonText width="w-64" height="h-8" />
        </div>
        <Skeleton className="w-36 h-12 rounded-lg" />
      </div>
      <SkeletonStatsGrid count={4} />
      <SkeletonFilterBar />
      <SkeletonTable rows={5} cols={6} />
    </div>
  );
};

// Komponen utama yang menerima prop "type"
const SkeletonLoading = ({ type = "default" }) => {
  switch (type) {
    case "dashboard":
      return <DashboardPageSkeleton />;
    case "books":
      return <BooksPageSkeleton />;
    case "loans":
      return <LoansPageSkeleton />;
    case "memberDashboard":
      return <MemberDashboardSkeleton />;
    case "catalog":
      return <CatalogPageSkeleton />;
    case "myLoans":
      return <MyLoansPageSkeleton />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen bg-surface">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-on-surface-variant font-medium">
              Loading...
            </p>
          </div>
        </div>
      );
  }
};

export const LoansPageSkeleton = () => {
  return (
    <div className="p-10 min-h-screen">
      {/* Header skeleton */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <SkeletonText width="w-48" height="h-8" className="mb-2" />
          <SkeletonText width="w-96" height="h-4" />
        </div>
        <Skeleton className="w-48 h-10 rounded-md" />
      </div>

      {/* 4 stat cards skeleton */}
      <SkeletonStatsGrid count={4} />

      {/* Filter bar skeleton (search + status buttons) */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Skeleton className="w-64 h-10 rounded-full" />
        <div className="flex gap-2">
          {Array(5)
            .fill()
            .map((_, i) => (
              <Skeleton key={i} className="w-16 h-10 rounded-md" />
            ))}
        </div>
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={4} cols={6} />
    </div>
  );
};

export const MemberDashboardSkeleton = () => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5">
          <SkeletonCard />
        </div>
        <div className="col-span-12 md:col-span-4">
          <SkeletonCard />
        </div>
        <div className="col-span-12 md:col-span-3">
          <SkeletonCard />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <SkeletonText width="w-24" height="h-4" />
            <SkeletonText width="w-48" height="h-8" className="mt-1" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="w-20 h-10 rounded-lg" />
            <Skeleton className="w-20 h-10 rounded-lg" />
          </div>
        </div>
        <Skeleton className="w-full h-80 rounded-xl" />
      </div>
      <div className="space-y-6">
        <div className="flex justify-between">
          <SkeletonText width="w-48" height="h-8" />
          <SkeletonText width="w-32" height="h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(4)
            .fill()
            .map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
        </div>
      </div>
    </div>
  );
};

export const CatalogPageSkeleton = () => {
  return (
    <div className="p-8 lg:p-12 flex-1">
      <div className="mb-12">
        <SkeletonText width="w-64" height="h-8" className="mb-2" />
        <SkeletonText width="w-96" height="h-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array(8)
          .fill()
          .map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4] rounded-xl" />
              <SkeletonText width="w-32" height="h-5" className="mt-2" />
              <SkeletonText width="w-24" height="h-3" className="mt-1" />
            </div>
          ))}
      </div>
    </div>
  );
};

export const MyLoansPageSkeleton = () => {
  return (
    <div className="px-10 pb-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <SkeletonText width="w-32" height="h-4" className="mb-2" />
          <SkeletonText width="w-48" height="h-8" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <SkeletonTable rows={4} cols={5} />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
