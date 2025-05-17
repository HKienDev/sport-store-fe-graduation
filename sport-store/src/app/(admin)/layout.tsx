"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { ROUTES } from '@/config/constants';
import Sidebar from '@/components/admin/adminLayout/sidebar';
import Topbar from '@/components/admin/adminLayout/topbar';
import Footer from '@/components/admin/adminLayout/footer';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, checkAuthStatus } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuthStatus();
            if (!user || user.role !== 'admin') {
                router.replace(ROUTES.LOGIN);
                return;
            }
            setIsLoading(false);
        };
        verifyAuth();
    }, [checkAuthStatus, router, user]);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.replace(ROUTES.LOGIN);
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-[clamp(4rem,8vw,8rem)] w-[clamp(4rem,8vw,8rem)] animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static lg:inset-0 w-[clamp(240px,25vw,280px)]`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${
                isSidebarOpen ? 'lg:ml-[clamp(240px,25vw,280px)]' : 'lg:ml-0'
            }`}>
                {/* Topbar */}
                <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Main Content Area */}
                <main className="flex-1 pt-[clamp(3rem,6vw,4rem)] pb-[clamp(3rem,6vw,4rem)] px-[clamp(0.5rem,2vw,1rem)] sm:px-[clamp(1rem,3vw,1.5rem)] lg:px-[clamp(1.5rem,4vw,2rem)]">
                    <div className="mx-auto max-w-[clamp(640px,90vw,1280px)]">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
