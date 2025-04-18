// src/components/layout/HustHeader.jsx
import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

/**
 * HustHeader: Header component with HUST branding.
 * @param {string} title - Title text
 * @param {string} subtitle - Subtitle text
 * @param {React.ReactNode} icon - Optional AntD icon element
 */
export default function HustHeader({ title, subtitle, icon }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-hust-red/5">
      {/* Logo HUST từ public folder */}
      <img
        src="/hust.jpg"
        alt="HUST logo"
        className="h-10 w-10 object-contain"
      />

      {/* Icon tùy chọn nếu cần */}
      {icon && <div className="text-hust-red text-3xl">{icon}</div>}

      {/* Tiêu đề và phụ đề */}
      <div>
        <Title level={4} className="!mb-0">
          {title}
        </Title>
        {subtitle && (
          <Text type="secondary" className="block">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
}
