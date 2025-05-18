import * as React from 'react';

interface AdminNewUserEmailProps {
  userName: string;
  userEmail: string;
  registerTime: string;
}

const AdminNewUserEmail: React.FC<AdminNewUserEmailProps> = ({
  userName,
  userEmail,
  registerTime,
}) => (
  <div>
    <h2>Người dùng mới đăng ký</h2>
    <p>Một người dùng mới vừa đăng ký tài khoản.</p>
    <p>
      <strong>Tên người dùng:</strong> {userName}
    </p>
    <p>
      <strong>Email:</strong> {userEmail}
    </p>
    <p>
      <strong>Thời gian đăng ký:</strong> {registerTime}
    </p>
    <p>Vui lòng kiểm tra để phát hiện bot hoặc spam nếu có dấu hiệu bất thường.</p>
  </div>
);

export default AdminNewUserEmail; 