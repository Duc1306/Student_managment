import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

function HustFooter() {
  return (
    <Footer className="text-center bg-hust-red-dark/5 py-3">
      <Text type="secondary">
        © {new Date().getFullYear()} HUST Đại học BKHN 
      </Text>
    </Footer>
  );
}

export default HustFooter;
