import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogDetail } from "../api/blog.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/categories.js";
import { Container } from "react-bootstrap";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBlogDetail(id);
        setBlog(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [id]);



  if (!blog) return <div className="container mt-5">Đang tải bài viết...</div>;

  return (
    <>
      <Header categories={categories} />
      <Container className="py-5">
        <h1 className="fw-bold text-success mb-4">{blog.title}</h1>

        <img
          src={blog.img}
          alt={blog.title}
          className="img-fluid rounded shadow mb-4"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />

        <p className="fs-5 text-muted">{blog.desc1}</p>
        <p className="fs-6 mb-4">{blog.desc2}</p>

        {/* Nội dung chi tiết */}
        <div
          className="fs-5"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </Container>
      <Footer />
    </>
  );
}

export default BlogDetail;
