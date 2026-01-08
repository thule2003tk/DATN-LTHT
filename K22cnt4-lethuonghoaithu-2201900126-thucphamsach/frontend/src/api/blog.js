const API_URL = "http://localhost:3001/api/blog"; // sửa port backend nếu khác (thường là 3001)

export const getAllBlog = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Lỗi lấy danh sách blog");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
export async function getBlogDetail(id) {
  const res = await fetch(`http://localhost:3001/api/blog/${id}`);
  if (!res.ok) throw new Error("Không thể load bài viết");
  return await res.json();
}

export const getBlogsByCategory = async (category) => {
  try {
    const res = await fetch(`${API_URL}?category=${category}`);
    if (!res.ok) throw new Error("Lỗi lấy blog theo tab");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addBlog = async (blogData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  });
  if (!res.ok) throw new Error("Lỗi thêm blog");
  return await res.json();
};

export const updateBlog = async (id, blogData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  });
  if (!res.ok) throw new Error("Lỗi cập nhật blog");
  return await res.json();
};

export const deleteBlog = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Lỗi xóa blog");
  return await res.json();
};