
const { Op } = require("sequelize");

module.exports = {
  createPagination: (req, defaultLimit = 6) => {
    const page = parseInt(req.query.page, 6) || 1;
    const limit = parseInt(req.query.limit, 6) || defaultLimit;
    const offset = (page - 1) * limit;
    return { page, limit, offset };
  },
  createSearchCondition: (fieldName, keyword) => {
    // Trả về điều kiện tìm kiếm kiểu like cho một trường cụ thể
    return keyword ? { [fieldName]: { [Op.like]: `%${keyword}%` } } : {};
  },
};
