import { useState, useEffect } from "react";

interface MonthYearSelectorProps {
  onChange: (month: number | null, year: number | null) => void;
}

const MonthYearSelector = ({ onChange }: MonthYearSelectorProps) => {
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    onChange(month, year);
  }, [month, year]);

  return (
    <div className="flex gap-2">
      <select
        value={month ?? ""}
        onChange={(e) => setMonth(e.target.value ? parseInt(e.target.value) : null)}
        className="border p-1 rounded"
      >
        <option value="">All Months</option>
        {months.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>

      <select
        value={year ?? ""}
        onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
        className="border p-1 rounded"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearSelector;
