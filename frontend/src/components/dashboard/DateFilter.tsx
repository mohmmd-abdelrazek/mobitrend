import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateFilterProps {
  onDateChange: (dates: { startDate: Date; endDate: Date }) => void;
}

const DateFilter = ({ onDateChange }: DateFilterProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 11)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const applyFilter = () => {
    if (startDate && endDate) {
      onDateChange({ startDate, endDate });
    }
  };

  return (
    <div className="flex items-center gap-8">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            isClearable={true}
            placeholderText="Select start date"
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            isClearable={true}
            placeholderText="Select end date"
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
        </div>
      <button onClick={applyFilter} className="px-2 py-1 text-sm font-md bg-blue-500 text-white rounded hover:bg-blue-600">Apply Filter</button>
    </div>
  );
};

export default DateFilter;
