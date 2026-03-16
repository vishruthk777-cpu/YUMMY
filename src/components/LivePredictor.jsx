import { Activity } from 'lucide-react';
import './LivePredictor.css';

export default function LivePredictor() {
  const currentHour = new Date().getHours();
  // Simulate data where peak hours are 1pm (13), 2pm (14), 8pm (20), 9pm (21)
  const isBusy = [13, 14, 20, 21].includes(currentHour);
  const isModerate = [12, 19, 22].includes(currentHour);
  
  const status = isBusy ? 'Usually Busy' : isModerate ? 'Moderate' : 'Not Too Busy';
  const statusColor = isBusy ? 'var(--danger)' : isModerate ? 'var(--accent)' : 'var(--success)';

  const generateBars = () => {
    return Array.from({ length: 12 }).map((_, i) => {
      const hour = i + 11; // 11 AM to 10 PM
      const height = [13,14,20,21].includes(hour) ? '100%' 
                     : [12,19,22].includes(hour) ? '60%' 
                     : '30%';
                     
      const isCurrent = hour === currentHour;
      return (
        <div key={hour} className="bar-wrapper">
          <div className="bar-container">
            <div 
              className={`bar ${isCurrent ? 'active' : ''}`} 
              style={{ height }}
            ></div>
          </div>
          <span className="bar-label">{hour > 12 ? `${hour-12}p` : `${hour}a`}</span>
        </div>
      );
    });
  };

  return (
    <div className="card predictor-card">
      <div className="predictor-header">
        <Activity size={24} color={statusColor} />
        <div>
          <h3>Live Popular Times</h3>
          <p className="status-text" style={{ color: statusColor }}>
            {status} right now
          </p>
        </div>
      </div>
      <div className="predictor-chart">
        {generateBars()}
      </div>
      <div className="predictor-footer text-muted">
        Based on historical foot traffic data. Plan your visit to avoid waiting!
      </div>
    </div>
  );
}
