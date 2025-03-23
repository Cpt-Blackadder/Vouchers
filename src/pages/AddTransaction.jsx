import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AddTransaction = () => {
  const [form, setForm] = useState({
    voucherNumber: '',
    date: '',
    name: '',
    bank: '',
    chequeNumber: '',
    amount: '',
    category: '',
    month: '',
    year: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.voucher; // Check if editing

  const names = ['Chandran C K', 'T Thayabari', 'Lakshmi Ramasamy', 'Shibu M', 'S S Raju', 'Radhakrishna Menon', 'Rajani M G', 'Sujatha Babu', 'M N Babu', 'Prem Sai T V', 'Sushanth N', 'Anjali Ramesh', 'Narayanan A', 'S Kumar'];
  const banks = ['State Bank of India', 'Union Bank of India', 'Kerala Gramin Bank', 'Federal Bank', 'Canara Bank', 'Bank of Baroda', 'Indian Overseas Bank'];
  const categories = ['Honorarium', 'Rent', 'Cleaning', 'Current Bill', 'Water Bill', 'Web', 'Travel', 'TA', 'Medicine', 'Phone', 'Food', 'Others'];

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...isEdit,
        year: isEdit.year || '', // Use the year field directly
      });
    }
  }, [isEdit]);

  const handleSubmit = () => {
    console.log('Saving form data:', form); // Debug log
    // Basic validation to prevent empty critical fields
    if (!form.voucherNumber || !form.date || !form.name || !form.amount || !form.month || !form.year) {
      alert('Please fill in all required fields (Voucher Number, Date, Name, Amount, Month, Year).');
      return;
    }

    if (isEdit) {
        axios.put(`https://vouchers-backend.vercel.app/${voucher.id}`, data)
        axios.post(`https://vouchers-backend.vercel.app/`, data).then(() => {
        alert('Transaction updated successfully!');
        navigate('/');
      }).catch((err) => {
        console.error('Update error:', err);
        alert('Failed to update transaction.');
      });
    } else {
      axios.post('http://localhost:5000/vouchers', form).then(() => {
        alert('Transaction saved successfully!');
        navigate('/');
      }).catch((err) => {
        console.error('Save error:', err);
        alert('Failed to save transaction.');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{isEdit ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <input
          type="text"
          placeholder="Voucher Number"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.voucherNumber}
          onChange={(e) => setForm({ ...form, voucherNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Date (DD/MM/YYYY)"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          list="names"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <datalist id="names">
          {names.map((n) => <option key={n} value={n} />)}
        </datalist>
        <input
          type="text"
          placeholder="Bank"
          list="banks"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.bank}
          onChange={(e) => setForm({ ...form, bank: e.target.value })}
        />
        <datalist id="banks">
          {banks.map((b) => <option key={b} value={b} />)}
        </datalist>
        <input
          type="text"
          placeholder="Cheque Number"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.chequeNumber}
          onChange={(e) => setForm({ ...form, chequeNumber: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {form.category === 'Others' && (
          <input
            type="text"
            placeholder="New Category"
            className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onBlur={(e) => setForm({ ...form, category: e.target.value })}
          />
        )}
        <input
          type="text"
          placeholder="Month"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />
        <div className="flex justify-between">
          <button onClick={() => navigate('/')} className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;