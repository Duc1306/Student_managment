// src/components/pagination/Pagination.jsx
import { Pagination as AntPagination } from "antd";

/**
 * Wrapper component for Ant Design Pagination with Tailwind centering
 * @param {number} currentPage - Trang hiện tại (1-indexed)
 * @param {number} totalPages - Tổng số trang
 * @param {function} onPageChange - Callback khi thay đổi trang (newPage)
 * @param {number} pageSize - Số bản ghi mỗi trang 
 */
function Pagination({ currentPage, totalPages, onPageChange, pageSize = 10 }) {
  // Tính tổng số bản ghi để AntPagination hiện đúng
  const totalItems = totalPages * pageSize;

  return (
    <div className="flex justify-center my-4">
      <AntPagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        showSizeChanger={false}
        onChange={onPageChange}
      />
    </div>
  );
}

export default Pagination;
