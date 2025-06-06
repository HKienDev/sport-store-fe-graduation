'use client';

import { useState, useEffect } from 'react';
import { TOKEN_CONFIG } from '@/config/token';
import type { Customer } from '@/types/customer';
import { API_URL } from "@/utils/api";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: {
    province: {
      name: string;
      code: number;
    };
    district: {
      name: string;
      code: number;
    };
    ward: {
      name: string;
      code: number;
    };
    street?: string;
  };
}

interface DeliveryInfoProps {
  onAddressChange: (shippingAddress: ShippingAddress) => void;
}

interface LocationOption {
  name: string;
  code: number | string;
}

export default function DeliveryInfo({ onAddressChange }: DeliveryInfoProps) {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<Customer | null>(null);
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: '',
  });

  // Fetch user info khi load component
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        if (!accessToken) {
          setUser(null);
          return;
        }
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
          setUser(null);
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data as Customer);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Hàm retry để gọi API với số lần thử lại
  const fetchWithRetry = async (url: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };

  // Khi user thay đổi, cập nhật form nếu có address
  useEffect(() => {
    const initializeAddress = async () => {
      if (!user?.address?.province || !user?.address?.district || !user?.address?.ward) return;

      setLoading(true);
      setError(null);
      try {
        // Lấy danh sách tỉnh
        const provincesData = await fetchWithRetry('https://provinces.open-api.vn/api/p/');
        const selectedProvince = provincesData.find((p: LocationOption) => p.name === user.address?.province);
        
        if (!selectedProvince) {
          throw new Error('Không tìm thấy tỉnh/thành phố');
        }

        // Lấy danh sách quận/huyện
        const provinceData = await fetchWithRetry(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
        const selectedDistrict = provinceData.districts.find((d: LocationOption) => d.name === user.address?.district);
        
        if (!selectedDistrict) {
          throw new Error('Không tìm thấy quận/huyện');
        }

        // Lấy danh sách phường/xã
        const districtData = await fetchWithRetry(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
        const selectedWard = districtData.wards.find((w: LocationOption) => w.name === user.address?.ward);
        
        if (!selectedWard) {
          throw new Error('Không tìm thấy phường/xã');
        }

        const shippingAddress: ShippingAddress = {
          fullName: user.fullname || '',
          phone: user.phone || '',
          address: {
            province: {
              name: user.address.province,
              code: Number(selectedProvince.code)
            },
            district: {
              name: user.address.district,
              code: Number(selectedDistrict.code)
            },
            ward: {
              name: user.address.ward,
              code: Number(selectedWard.code)
            },
            street: user.address.street,
          },
        };
        onAddressChange(shippingAddress);
      } catch (err) {
        console.error('Error fetching address data:', err);
        setError('Không thể tải thông tin địa chỉ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setForm({
        fullName: user.fullname || '',
        phone: user.phone || '',
        province: user.address?.province || '',
        district: user.address?.district || '',
        ward: user.address?.ward || '',
        street: user.address?.street || '',
      });

      initializeAddress();
    }
  }, [user, onAddressChange]);

  // Lấy danh sách tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      if (!showForm) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithRetry('https://provinces.open-api.vn/api/p/');
        setProvinces(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [showForm]);

  // Lấy danh sách quận khi chọn tỉnh
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!form.province) {
        setDistricts([]);
        setWards([]);
        setForm(f => ({ ...f, district: '', ward: '' }));
        return;
      }

      const selectedProvince = provinces.find(p => p.name === form.province);
      if (!selectedProvince) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithRetry(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
        setDistricts(data.districts);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError('Không thể tải danh sách quận/huyện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [form.province, provinces]);

  // Lấy danh sách phường khi chọn quận
  useEffect(() => {
    const fetchWards = async () => {
      if (!form.district) {
        setWards([]);
        setForm(f => ({ ...f, ward: '' }));
        return;
      }

      const selectedDistrict = districts.find(d => d.name === form.district);
      if (!selectedDistrict) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithRetry(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
        setWards(data.wards);
      } catch (err) {
        console.error('Error fetching wards:', err);
        setError('Không thể tải danh sách phường/xã. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, [form.district, districts]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!form.province) newErrors.province = 'Chọn tỉnh/thành phố';
    if (!form.district) newErrors.district = 'Chọn quận/huyện';
    if (!form.ward) newErrors.ward = 'Chọn phường/xã';
    setError(null);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedProvince = provinces.find(p => p.name === form.province);
    const selectedDistrict = districts.find(d => d.name === form.district);
    const selectedWard = wards.find(w => w.name === form.ward);

    const shippingAddress: ShippingAddress = {
      fullName: form.fullName,
      phone: form.phone,
      address: {
        province: {
          name: form.province,
          code: Number(selectedProvince?.code) || 0
        },
        district: {
          name: form.district,
          code: Number(selectedDistrict?.code) || 0
        },
        ward: {
          name: form.ward,
          code: Number(selectedWard?.code) || 0
        },
        street: form.street,
      },
    };
    onAddressChange(shippingAddress);
    setUser((prev) =>
      prev
        ? {
            ...prev,
            fullname: form.fullName,
            phone: form.phone,
            address: {
              province: form.province,
              district: form.district,
              ward: form.ward,
              street: form.street,
            },
          }
        : null
    );
    setShowForm(false);
  };

  // Kiểm tra address có rỗng không
  const isAddressEmpty =
    !user ||
    !user.address ||
    !user.address.province ||
    !user.address.district ||
    !user.address.ward;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">GIAO TỚI</h2>
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      {!showForm ? (
        <div className="border-b border-gray-200 pb-4">
          {user ? (
            <>
              <div className="flex justify-between items-start">
                <h3 className="text-base font-medium text-gray-900">{user.fullname || ''}</h3>
                <span className="text-gray-600">{user.phone || ''}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {isAddressEmpty
                  ? 'Chưa có địa chỉ giao hàng'
                  : `${user.address.street ? `${user.address.street}, ` : ''}${user.address.ward}, ${user.address.district}, ${user.address.province}`
                }
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Đang tải thông tin người dùng...</p>
          )}
        </div>
      ) : (
        <form className="space-y-4 border-b border-gray-200 pb-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên *</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố *</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              value={form.province}
              onChange={e => setForm(f => ({ ...f, province: e.target.value }))}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map(province => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quận/Huyện *</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              value={form.district}
              onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
              disabled={!form.province}
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map(district => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phường/Xã *</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              value={form.ward}
              onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
              disabled={!form.district}
            >
              <option value="">Chọn phường/xã</option>
              {wards.map(ward => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
              value={form.street}
              onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
              placeholder="Số nhà, tên đường..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Xác nhận
            </button>
          </div>
        </form>
      )}
      {!showForm && (
        <button
          type="button"
          className="mt-4 text-sm font-medium text-red-600 hover:text-red-500"
          onClick={() => setShowForm(true)}
        >
          {isAddressEmpty ? 'Thêm địa chỉ giao hàng' : 'Thay đổi địa chỉ giao hàng'}
        </button>
      )}
    </div>
  );
} 