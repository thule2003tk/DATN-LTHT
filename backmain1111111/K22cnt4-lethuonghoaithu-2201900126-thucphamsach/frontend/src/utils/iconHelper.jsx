import {
    FaLeaf,
    FaAppleAlt,
    FaFish,
    FaDrumstickBite,
    FaCarrot,
    FaBoxOpen,
    FaSeedling,
    FaBreadSlice,
    FaLemon,
    FaCoffee,
    FaMortarPestle
} from "react-icons/fa";
import { GiGrapes } from "react-icons/gi";

/**
 * Hàm giúp lấy icon phù hợp cho danh mục
 * Ưu tiên: Emoji từ DB > Tự nhận diện qua tên > Icon mặc định
 */
export const getCategoryIcon = (iconStr, categoryName = "") => {
    const name = categoryName.toLowerCase();
    const rawIcon = (iconStr || "").trim();

    // 1. Nếu người dùng nhập Emoji hoặc mã Icon cụ thể từ Admin
    if (rawIcon && rawIcon.toLowerCase() !== name) {
        // Nếu là Emoji (thường 1-4 ký tự đặc biệt)
        if (rawIcon.length <= 4) {
            return <span style={{ fontSize: '1.2rem' }}>{rawIcon}</span>;
        }
        // Nếu là mã FA code (fa-leaf, ...)
        if (rawIcon.startsWith("fa-")) {
            if (rawIcon.includes("leaf")) return <FaLeaf />;
            if (rawIcon.includes("apple")) return <FaAppleAlt />;
            if (rawIcon.includes("seedling")) return <FaSeedling />;
        }
        // Nếu là chuỗi ngắn không có khoảng trắng (coi như biểu tượng văn bản)
        if (rawIcon.length <= 10 && !rawIcon.includes(" ")) {
            return <span style={{ fontSize: '1.1rem' }}>{rawIcon}</span>;
        }
    }

    // 2. Tìm kiếm thông minh dựa trên Tên danh mục (Fallback)
    if (name.includes("rau") || name.includes("củ") || name.includes("quả")) return <FaCarrot />;
    if (name.includes("thịt") || name.includes("bò") || name.includes("lợn") || name.includes("gà")) return <FaDrumstickBite />;
    if (name.includes("hải sản") || name.includes("cá") || name.includes("tôm") || name.includes("cua")) return <FaFish />;
    if (name.includes("khô") || name.includes("đóng hộp")) return <FaBoxOpen />;
    if (name.includes("trái cây") || name.includes("hoa quả")) return <GiGrapes />;
    if (name.includes("ngũ cốc") || name.includes("hạt") || name.includes("đậu")) return <FaSeedling />;
    if (name.includes("dược liệu") || name.includes("thuốc") || name.includes("sâm")) return <FaMortarPestle />;
    if (name.includes("chế biến") || name.includes("món ăn") || name.includes("bếp")) return <FaBreadSlice />;
    if (name.includes("gia vị") || name.includes("muối") || name.includes("tiêu")) return <FaLemon />;
    if (name.includes("nước") || name.includes("đồ uống") || name.includes("sữa")) return <FaCoffee />;

    // 3. Mặc định mầm cây nếu không tìm thấy gì phù hợp
    return <FaLeaf />;
};

export const ICON_SUGGESTIONS = [
    { label: "Rau củ", icons: ["🥦", "🥕", "🥬", "🫑", "🌽", "🥔", "🥒", "🍅"] },
    { label: "Thịt & Trứng", icons: ["🥩", "🍗", "🍖", "🥓", "🥚", "🍳"] },
    { label: "Hải sản", icons: ["🐟", "🦐", "🦀", "🦑", "🐙", "🐚"] },
    { label: "Trái cây", icons: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍍", "🥭", "🥝"] },
    { label: "Đồ uống", icons: ["🥛", "🥤", "🧃", "🍵", "☕", "🍺", "🍷"] },
    { label: "Đồ khô & Gia vị", icons: ["📦", "🧂", "🍜", "🍚", "🍞", "🧀"] },
    { label: "Dược liệu", icons: ["🌿", "🍃", "🌵", "🧪", "🍯"] },
];
