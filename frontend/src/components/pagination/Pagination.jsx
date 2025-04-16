import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Tạo mảng số trang để hiển thị (bạn có thể điều chỉnh logic hiển thị số trang)
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/* Nút đến trang đầu tiên */}
        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
          <button className="page-link" onClick={() => onPageChange(1)}>
            First
          </button>
        </li>

        {/* Nút trang trước */}
        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </button>
        </li>

        {/* Hiển thị số trang */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number && "active"}`}
          >
            <button className="page-link" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}

        {/* Nút trang kế */}
        <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>

        {/* Nút đến trang cuối cùng */}
        <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
