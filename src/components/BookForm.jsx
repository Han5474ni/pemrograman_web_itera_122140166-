import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'dimiliki'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (book) {
      setFormData(book);
    }
  }, [book]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Judul buku minimal 2 karakter';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Judul buku maksimal 100 karakter';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi';
    } else if (formData.author.length < 2) {
      newErrors.author = 'Nama penulis minimal 2 karakter';
    } else if (formData.author.length > 50) {
      newErrors.author = 'Nama penulis maksimal 50 karakter';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.author)) {
      newErrors.author = 'Nama penulis hanya boleh mengandung huruf dan spasi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        onSubmit(formData);
        setFormData({ title: '', author: '', status: 'dimiliki' });
        setTouched({});
        setErrors({});
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: 'Terjadi kesalahan saat menyimpan data' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validasi saat mengetik
    if (touched[name]) {
      const fieldErrors = {};
      if (name === 'title') {
        if (!value.trim()) fieldErrors.title = 'Judul buku wajib diisi';
        else if (value.length < 2) fieldErrors.title = 'Judul buku minimal 2 karakter';
        else if (value.length > 100) fieldErrors.title = 'Judul buku maksimal 100 karakter';
      }
      if (name === 'author') {
        if (!value.trim()) fieldErrors.author = 'Nama penulis wajib diisi';
        else if (value.length < 2) fieldErrors.author = 'Nama penulis minimal 2 karakter';
        else if (value.length > 50) fieldErrors.author = 'Nama penulis maksimal 50 karakter';
        else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          fieldErrors.author = 'Nama penulis hanya boleh mengandung huruf dan spasi';
        }
      }
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="book-form" noValidate>
      {errors.submit && <div className="error global-error">{errors.submit}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Judul Buku:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.title && touched.title ? 'error-input' : ''}
          maxLength="100"
          required
        />
        {errors.title && touched.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">Penulis:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.author && touched.author ? 'error-input' : ''}
          maxLength="50"
          required
        />
        {errors.author && touched.author && <span className="error">{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="dimiliki">Dimiliki</option>
          <option value="dibaca">Sedang Dibaca</option>
          <option value="ingin_beli">Ingin Dibeli</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">{book ? 'Update' : 'Tambah'} Buku</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

BookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default BookForm;