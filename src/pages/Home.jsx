import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Home = () => {
  const [month, setMonth] = useState(() => localStorage.getItem('selectedMonth') || '');
  const [year, setYear] = useState(() => localStorage.getItem('selectedYear') || '');
  const [vouchers, setVouchers] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (month && year) {
      console.log('Fetching data for:', { month, year });
      // Temporarily mock the response
      const mockData = [];
      const sortedData = [...mockData].sort((a, b) => parseDate(a.date) - parseDate(b.date));
      setVouchers(sortedData);
      setTotal(sortedData.reduce((sum, v) => sum + v.amount, 0));
      /*
      axios.get(`https://kvvk-vouchers-backend.onrender.com/vouchers/${month}?year=${year}`).then((res) => {
        console.log('Fetched data:', res.data);
        const sortedData = [...res.data].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        setVouchers(sortedData);
        setTotal(sortedData.reduce((sum, v) => sum + v.amount, 0));
      }).catch((err) => console.error('Fetch error:', err));
      */
    }
  }, [month, year]);

  useEffect(() => {
    localStorage.setItem('selectedMonth', month);
    localStorage.setItem('selectedYear', year);
  }, [month, year]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/vouchers/${id}`).then(() => {
      setVouchers(vouchers.filter((v) => v.id !== id));
    });
  };

  const handleEdit = (voucher) => {
    navigate('/add', { state: { voucher } });
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is 0-based in JS Date
  };

  const generatePDF = () => {
    console.log('Generating PDF for:', { month, year, vouchers });
    const doc = new jsPDF({ orientation: 'landscape' });

    // Banner: Heading
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setCharSpace(0);
    doc.text('Kerala Vanavasi Vikasa Kendram', 148.5, 20, { align: 'center' });

    // Subheading: Month and Year
    doc.setFont('times', 'normal');
    doc.setFontSize(16);
    doc.setCharSpace(0);
    doc.text(`Vouchers for ${month} ${year}`, 148.5, 30, { align: 'center' });

    // Total Expense: Using "Rs." instead of rupee symbol
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setCharSpace(0.5);
    const totalText = `Total Expense:${total.toFixed(2)}`;
    const textWidth = doc.getTextWidth(totalText);
    const pageWidth = 297;
    const xPosition = (pageWidth - textWidth) / 2;
    doc.text(totalText, xPosition, 40);

    // Reset font and spacing for table
    doc.setFont('times', 'normal');
    doc.setCharSpace(0);

    // Draw a line under the banner for separation
    doc.setLineWidth(0.5);
    doc.line(20, 45, 277, 45);

    // Sort vouchers by date in ascending order
    const sortedVouchers = [...vouchers].sort((a, b) => parseDate(a.date) - parseDate(b.date));

    // Add serial numbers and prepare table data with new column order
    const tableData = sortedVouchers.map((v, index) => [
      index + 1, // Serial No
      v.voucherNumber,
      v.date,
      v.chequeNumber || '', // Moved Cheque Number here
      v.name,
      v.bank,
      v.amount,
      v.category
    ]);

    // Table with new column order
    autoTable(doc, {
      head: [['Serial No', 'Voucher Number', 'Date', 'Cheque Number', 'Name', 'Bank', 'Amount', 'Category']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontSize: 12,
        font: 'times',
        halign: 'center'
      },
      bodyStyles: {
        font: 'times',
        fontSize: 10,
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { halign: 'center' }, // Serial No
        2: { halign: 'center' }, // Date
        6: { halign: 'right' }   // Amount (now at index 6)
      }
    });

    // Save the PDF
    doc.save(`${month}_${year}_vouchers.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 tracking-tight">KVVK Vouchers</h1>
      <div className="flex space-x-6 mb-8">
        <select
          className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Enter full year (e.g., 2025)"
          className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      {month && year && (
        <>
          <div className="flex justify-between w-11/12 max-w-4xl mb-6">
            <Link to="/add" className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">Add New Entry</Link>
            <button onClick={generatePDF} className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition">Generate PDF</button>
          </div>
          <div className="w-11/12 max-w-4xl bg-white rounded-lg shadow-lg p-6">
            <p className="text-right text-lg font-medium text-gray-700 mb-4">Total: <span className="font-bold">{total}</span></p>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 p-3 font-semibold">Serial No</th>
                  <th className="border border-gray-300 p-3 font-semibold">Voucher Number</th>
                  <th className="border border-gray-300 p-3 font-semibold">Date</th>
                  <th className="border border-gray-300 p-3 font-semibold">Cheque Number</th>
                  <th className="border border-gray-300 p-3 font-semibold">Name</th>
                  <th className="border border-gray-300 p-3 font-semibold">Bank</th>
                  <th className="border border-gray-300 p-3 font-semibold">Amount</th>
                  <th className="border border-gray-300 p-3 font-semibold">Category</th>
                  <th className="border border-gray-300 p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v, index) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="border border-gray-300 p-3">{index + 1}</td>
                    <td className="border border-gray-300 p-3">{v.voucherNumber}</td>
                    <td className="border border-gray-300 p-3">{v.date}</td>
                    <td className="border border-gray-300 p-3">{v.chequeNumber || ''}</td>
                    <td className="border border-gray-300 p-3">{v.name}</td>
                    <td className="border border-gray-300 p-3">{v.bank}</td>
                    <td className="border border-gray-300 p-3">{v.amount}</td>
                    <td className="border border-gray-300 p-3">{v.category}</td>
                    <td className="border border-gray-300 p-3">
                      <button onClick={() => handleEdit(v)} className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;