"use client";
import { Metadata } from 'next';
import AddCouponClient from './addCouponClient';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export default function AddCouponPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
        router.push('/auth/login');
        return null;
    }

    return <AddCouponClient />;
} 