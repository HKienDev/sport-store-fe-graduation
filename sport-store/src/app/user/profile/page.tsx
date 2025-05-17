'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import ProfileUser from "@/components/user/profileUser/userProfileForm";
import OrderUserPage from "@/components/user/orderUser/orderUserPage";
import { useSearchParams, useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';

function ProfilePageContent() {
  const [scrolled, setScrolled] = useState(false);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'orders' ? 'orders' : 'profile');
  const router = useRouter();

  // Handle scroll effect for the sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam === 'orders') {
      setActiveTab('orders');
    }
  }, [tabParam]);

  useEffect(() => {
    let isMounted = true;
    // Fetch profile để kiểm tra role
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!isMounted) return;
        if (!data?.success || !data?.data) {
          router.replace('/login');
        } else if (data.data.role === 'admin') {
          router.replace('/admin/dashboard');
        }
      } catch {
        if (isMounted) router.replace('/login');
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Blue Accent */}
      <div className={`sticky top-0 z-10 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md py-2" : "py-4"
      }`}>
        {/* Header content can be added here */}
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-8 pb-16">
        {/* Profile Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-10 rounded-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quản lý thông tin cá nhân</h2>
              <p className="mt-2 text-blue-100">Cập nhật thông tin và kiểm tra đơn hàng của bạn</p>
            </div>
            
            {/* User Avatar - Optional */}
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-6 font-medium text-sm transition-colors focus:outline-none ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Thông tin cá nhân</span>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-6 font-medium text-sm transition-colors focus:outline-none ${
              activeTab === 'orders' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Lịch sử đơn hàng</span>
            </div>
          </button>
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600 transform transition hover:shadow-xl h-full">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 ml-3">Thông tin cá nhân</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="ml-3 text-sm text-gray-600">
                  Cập nhật thông tin cá nhân của bạn để trải nghiệm mua sắm thuận tiện hơn. Thông tin của bạn sẽ được bảo mật an toàn.
                </p>
              </div>
            </div>
            
            <ProfileUser />
          
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600 transform transition hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 ml-3">Lịch sử đơn hàng</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="ml-3 text-sm text-gray-600">
                  Theo dõi và quản lý các đơn hàng của bạn. Bạn có thể kiểm tra trạng thái, theo dõi đơn hàng và xem lịch sử mua sắm.
                </p>
              </div>
            </div>
            
            <OrderUserPage />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}