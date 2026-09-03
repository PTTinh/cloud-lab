import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'https://bookish-lamp-jq7pjpq4p4x3p595-5000.app.github.dev/api/students';

  // Câu 47: Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Câu 48 & 49: Xử lý submit Form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi lưu sinh viên:', err);
    }
  };

  // Hỗ trợ Câu 61 & 62
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({ studentId: student.studentId, name: student.name, email: student.email });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Quản lý Sinh viên</h2>

      {/* Form nhập liệu */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Họ tên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ studentId: '', name: '', email: '' }); }}>
            Hủy
          </button>
        )}
      </form>

      {/* Bảng danh sách sinh viên */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Sửa</button>
                <button onClick={() => handleDelete(s._id)} style={{ marginLeft: 6, color: 'red' }}>Xóa</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan="4" align="center">Chưa có sinh viên nào.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;