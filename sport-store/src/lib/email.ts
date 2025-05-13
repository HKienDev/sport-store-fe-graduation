import { render } from '@react-email/render';
import axios from 'axios';
import { API_URL } from '@/utils/api';
import { OrderEmailProps } from '@/types/email';
import React from 'react';

interface SendEmailParams {
  to: string;
  subject: string;
  template: React.ComponentType<OrderEmailProps>;
  templateProps: OrderEmailProps;
}

export const sendEmailFromTemplate = async ({ to, subject, template: Template, templateProps }: SendEmailParams) => {
  console.log('\n=== DEBUG FRONTEND EMAIL ===');
  console.log('Request Info:');
  console.log('- To:', to);
  console.log('- Subject:', subject);
  console.log('- Template:', Template.name);
  console.log('- Template Props:', JSON.stringify(templateProps, null, 2));

  try {
    // Render template thành HTML
    console.log('\nRendering template...');
    const html = await render(React.createElement(Template, templateProps));
    console.log('✓ Template rendered successfully');
    console.log('- HTML length:', html.length);
    console.log('- First 100 chars:', html.substring(0, 100) + '...');

    // Gửi request đến BE
    console.log('\nSending request to BE...');
    const response = await axios.post(
      `${API_URL}/api/email/send`,
      {
        to,
        subject,
        html
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    console.log('✓ Email sent successfully');
    console.log('- Response:', response.data);
    console.log('=== END DEBUG ===\n');
    return response.data;
  } catch (error) {
    console.error('\n✗ Error sending email:', error);
    console.error('=== END DEBUG ===\n');
    throw new Error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi email');
  }
}; 