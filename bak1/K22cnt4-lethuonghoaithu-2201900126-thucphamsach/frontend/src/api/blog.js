const API_URL = "http://localhost:3001/api/blog";

export const getAllBlog = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error("Lỗi GET all blog:", res.status, await res.text());
      throw new Error("Lỗi lấy danh sách blog");
    }
    return await res.json();
  } catch (err) {
    console.error("getAllBlog error:", err);
    return [];
  }
};

export const getBlogDetail = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Không thể load bài viết");
    return await res.json();
  } catch (err) {
    console.error("getBlogDetail error:", err);
    return null;
  }
};

export const getBlogsByCategory = async (category) => {
  try {
    const res = await fetch(`${API_URL}?category=${category}`);
    if (!res.ok) {
      console.error("Lỗi GET blog category:", category, res.status, await res.text());
      throw new Error("Lỗi lấy blog theo tab");
    }
    return await res.json();
  } catch (err) {
    console.error("getBlogsByCategory error:", err);
    return [];
  }
};

export const addBlog = async (blogData) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    });
    if (!res.ok) throw new Error("Lỗi thêm blog");
    return await res.json();
  } catch (err) {
    console.error("addBlog error:", err);
    throw err;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    });
    if (!res.ok) throw new Error("Lỗi cập nhật blog");
    return await res.json();
  } catch (err) {
    console.error("updateBlog error:", err);
    throw err;
  }
};

export const deleteBlog = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Lỗi xóa blog");
    return await res.json();
  } catch (err) {
    console.error("deleteBlog error:", err);
    throw err;
  }
};