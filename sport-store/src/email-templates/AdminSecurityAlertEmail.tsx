import * as React from 'react';

interface AdminSecurityAlertEmailProps {
  alertType: string;
  description: string;
  alertTime: string;
  ipAddress: string;
  userAgent: string;
}

const AdminSecurityAlertEmail: React.FC<AdminSecurityAlertEmailProps> = ({
  alertType,
  description,
  alertTime,
  ipAddress,
  userAgent,
}) => (
  <div>
    <h2>Cảnh báo bảo mật</h2>
    <p>
      <strong>Loại cảnh báo:</strong> {alertType}
    </p>
    <p>
      <strong>Mô tả:</strong> {description}
    </p>
    <p>
      <strong>Thời gian:</strong> {alertTime}
    </p>
    <p>
      <strong>IP:</strong> {ipAddress}
    </p>
    <p>
      <strong>User Agent:</strong> {userAgent}
    </p>
    <p>Vui lòng kiểm tra và xử lý nếu phát hiện dấu hiệu bất thường.</p>
  </div>
);

export default AdminSecurityAlertEmail; 