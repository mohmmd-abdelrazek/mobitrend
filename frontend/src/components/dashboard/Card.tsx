interface DashboardCardProps {
  title: string;
  value: string | number;
}

const DashboardCard = ({ title, value } : DashboardCardProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-xl">{value}</p>
    </div>
  );
};

export default DashboardCard;
