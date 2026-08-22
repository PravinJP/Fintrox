import React from 'react';

interface Alert {
  id: number;
  type: 'overdue' | 'route' | 'approval';
  title: string;
  description: string;
}

interface OverdueAlertsProps {
  alerts: Alert[];
}

const OverdueAlerts: React.FC<OverdueAlertsProps> = ({ alerts }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'assignment_late';
      case 'route':
        return 'route';
      case 'approval':
        return 'account_balance_wallet';
      default:
        return 'info';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'bg-[#ffdad6]/30 border-[#ffdad6]';
      default:
        return 'bg-[#eef5f7] border-[#bfc9c1]';
    }
  };

  const getTextColor = (type: string) => {
    return type === 'overdue' ? 'text-[#ba1a1a]' : 'text-[#3f6653]';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#161d1f] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ba1a1a]">warning</span> Alerts
        </h3>
      </div>
      <ul className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`p-3 border rounded-lg flex items-start gap-3 ${getBgColor(alert.type)}`}
          >
            <span className={`material-symbols-outlined mt-0.5 text-[20px] ${getTextColor(alert.type)}`}>
              {getIcon(alert.type)}
            </span>
            <div>
              <p className="text-[14px] leading-[20px] text-[#161d1f] font-medium">{alert.title}</p>
              <p className="text-[12px] leading-[16px] tracking-[0.02em] font-medium text-[#404943] mt-0.5">
                {alert.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverdueAlerts;