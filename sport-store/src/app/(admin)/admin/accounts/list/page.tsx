"use client";

import React, { useState } from "react";
import { 
  Lock, 
  Edit,  
  X, 
  Save, 
  AlertCircle 
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

const initialRolesData = [
  {
    category: "Quản lý sản phẩm",
    permissions: [
      { id: 1, name: "Xem sản phẩm", roles: [true, true, true, false, false, true] },
      { id: 2, name: "Thêm sản phẩm", roles: [false, true, true, false, false, true] },
      { id: 3, name: "Cập nhật sản phẩm", roles: [false, true, true, false, false, true] },
      { id: 4, name: "Xóa sản phẩm", roles: [false, false, true, false, false, true] },
    ],
  },
  {
    category: "Quản lý đơn hàng",
    permissions: [
      { id: 5, name: "Xem đơn hàng", roles: [true, true, true, true, false, true] },
      { id: 6, name: "Xác nhận đơn hàng", roles: [false, true, true, false, false, true] },
      { id: 7, name: "Hủy đơn hàng", roles: [false, false, true, false, false, true] },
    ],
  },
];

const roleNames = ["Khách hàng", "Nhân viên", "Quản lý kho", "Marketing", "CSKH", "Admin"];

export default function AdminRolesList() {
  const [rolesData, setRolesData] = useState(initialRolesData);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/auth/login');
    return null;
  }

  const handlePermissionToggle = (groupIndex: number, permIndex: number, roleIndex: number) => {
    if (!isEditing) return;

    const newRolesData = [...rolesData];
    newRolesData[groupIndex].permissions[permIndex].roles[roleIndex] = 
      !newRolesData[groupIndex].permissions[permIndex].roles[roleIndex];
    
    setRolesData(newRolesData);
    setUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // Implement actual save logic here (e.g., API call)
    setIsEditing(false);
    setUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    if (unsavedChanges) {
      setConfirmDialogOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const discardChanges = () => {
    setRolesData(initialRolesData);
    setIsEditing(false);
    setUnsavedChanges(false);
    setConfirmDialogOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Lock className="mr-2 text-blue-600" /> 
              Quản lý phân quyền
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý và điều chỉnh quyền truy cập cho các nhóm thành viên
            </p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
                >
                  <X className="mr-2 h-4 w-4" /> Hủy
                </button>
                <button 
                  onClick={handleSaveChanges}
                  disabled={!unsavedChanges}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    unsavedChanges 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                </button>
              </>
            )}
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold text-gray-700 w-1/3">Quyền</th>
                {roleNames.map((role, index) => (
                  <th 
                    key={`role-${index}`} 
                    className="p-3 text-center font-semibold text-gray-700"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rolesData.map((group, groupIndex) => (
                <React.Fragment key={`group-${groupIndex}`}>
                  <tr className="bg-gray-200">
                    <td 
                      colSpan={roleNames.length + 1} 
                      className="p-3 font-semibold text-gray-600"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.permissions.map((perm, permIndex) => (
                    <tr 
                      key={`perm-${perm.id}`} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-700">
                        {perm.name}
                      </td>
                      {perm.roles.map((checked, roleIndex) => (
                        <td 
                          key={`perm-${perm.id}-role-${roleIndex}`} 
                          className="p-3 text-center"
                        >
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => 
                                handlePermissionToggle(
                                  groupIndex, 
                                  permIndex, 
                                  roleIndex
                                )
                              }
                              disabled={!isEditing}
                              className={`form-checkbox h-5 w-5 ${
                                isEditing 
                                  ? "text-blue-600 cursor-pointer" 
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Discard Changes Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center mb-4">
              <AlertCircle className="mr-2 text-yellow-500" /> 
              <h3 className="text-lg font-semibold">Bạn có chắc chắn muốn hủy?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Bạn có các thay đổi chưa được lưu. Bạn có muốn hủy các thay đổi này không?
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Tiếp tục chỉnh sửa
              </button>
              <button 
                onClick={discardChanges}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Hủy thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}