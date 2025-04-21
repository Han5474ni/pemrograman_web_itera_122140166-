import { useBookStats } from '../hooks/useBookStats';

const Stats = () => {
  const stats = useBookStats();

  return (
    <div className="stats">
      <h1>Statistik Buku</h1>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Buku</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card owned">
          <h3>Buku Dimiliki</h3>
          <p>{stats.dimiliki}</p>
        </div>

        <div className="stat-card reading">
          <h3>Sedang Dibaca</h3>
          <p>{stats.dibaca}</p>
        </div>

        <div className="stat-card wishlist">
          <h3>Ingin Dibeli</h3>
          <p>{stats.ingin_beli}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;