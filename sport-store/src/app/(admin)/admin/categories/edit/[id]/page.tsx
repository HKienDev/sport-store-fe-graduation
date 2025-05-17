"use client";
import EditCategoryClient from "@/components/admin/categories/edit/EditCategoryClient";
import { useAuth } from "@/context/authContext";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/auth/login');
    return null;
  }

  return <EditCategoryClient categoryId={id} />;
} 