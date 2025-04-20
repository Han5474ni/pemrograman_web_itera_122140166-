# Aplikasi Manajemen Buku

## Deskripsi Aplikasi
Aplikasi Manajemen Buku adalah sebuah aplikasi web modern yang dibangun menggunakan React untuk membantu pengguna mengelola koleksi buku mereka. Aplikasi ini memungkinkan pengguna untuk menambah, mengedit, dan menghapus buku, serta melacak status buku (dimiliki/dibaca).

## Fitur Utama
- Manajemen buku (tambah, edit, hapus)
- Filter dan pencarian buku
- Statistik koleksi buku
- Antarmuka responsif
- Penyimpanan data lokal menggunakan localStorage

## Teknologi yang Digunakan
- React 18
- Vite (build tool)
- React Testing Library & Vitest
- CSS Modern (Flexbox & Grid)
- LocalStorage API

## Instalasi dan Menjalankan Aplikasi

1. Clone repositori ini
```bash
git clone [url-repositori]
cd [nama-folder]
```

2. Install dependensi
```bash
npm install
```

3. Jalankan aplikasi dalam mode development
```bash
npm run dev
```

4. Build untuk production
```bash
npm run build
```

## Screenshot Antarmuka

### Halaman Utama
![Halaman Utama](screenshots/home.png)
*Tampilan halaman utama dengan daftar buku dan form penambahan*

### Halaman Statistik
![Halaman Statistik](screenshots/stats.png)
*Tampilan halaman statistik koleksi buku*

## Fitur React yang Digunakan

### 1. Context API (BookContext)
```jsx
// Implementasi Context untuk state management global
const BookContext = createContext();

export const BookProvider = ({ children }) => {
  // State dan logic management
};
```

### 2. Custom Hooks
- `useBookFilter`: Hook untuk filtering dan pencarian buku
- `useBookStats`: Hook untuk kalkulasi statistik buku

### 3. Component Composition
- Komponen terpisah untuk form, filter, dan card
- Reusable components dengan props drilling minimal

## Testing

Aplikasi ini menggunakan React Testing Library dan Vitest untuk testing. Beberapa test yang diimplementasi:

### Context Testing
```jsx
// BookContext.test.jsx
describe('BookContext', () => {
  it('provides initial empty books state', () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );
    expect(screen.getByTestId('book-count')).toHaveTextContent('0');
  });
});
```

### Component Testing
```jsx
// BookForm.test.jsx
describe('BookForm', () => {
  it('submits form with valid data', () => {
    // Test implementation
  });
});
```

## Screenshot Hasil Testing
![Hasil Testing](screenshots/test-results.png)
*Screenshot hasil running test suite*

## Komentar Kode

Beberapa bagian penting dalam kode telah diberi komentar untuk memudahkan pemahaman:

```jsx
// Implementasi localStorage persistence
useEffect(() => {
  try {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) setBooks(JSON.parse(storedBooks));
  } catch (error) {
    console.error('Error loading books:', error);
  }
}, []);
```

## Kontribusi
Kontribusi selalu diterima. Silakan buat pull request untuk perbaikan atau penambahan fitur.

## Lisensi
MIT License
