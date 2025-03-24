import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { voucher } = location.state || {};
  const isEdit = !!voucher;

  const [form, setForm] = useState({
    voucherNumber: voucher?.voucherNumber || '',
    date: voucher?.date || '',
    name: voucher?.name || '',
    bank: voucher?.bank || '',
    chequeNumber: voucher?.chequeNumber || '',
    amount: voucher?.amount || '',
    category: voucher?.category || '',
    month: voucher?.month || '',
    year: voucher?.year || '',
    id: voucher?.id || null,
  });

  const [categories, setCategories] = useState([]);
  const [names, setNames] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [customName, setCustomName] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch unique categories and names when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://vouchers-backend.vercel.app/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchNames = async () => {
      try {
        const res = await axios.get('https://vouchers-backend.vercel.app/names');
        setNames(res.data);
      } catch (err) {
        console.error('Error fetching names:', err);
      }
    };

    fetchCategories();
    fetchNames();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Saving form data:', form);
    if (!form.voucherNumber || !form.date || !form.name || !form.amount || !form.month || !form.year) {
      alert('Please fill in all required fields (Voucher Number, Date, Name, Amount, Month, Year).');
      return;
    }

    const finalForm = {
      ...form,
      name: form.name === 'Other' ? customName : form.name,
      category: form.category === 'Other' ? customCategory : form.category,
    };

    if (isEdit) {
      axios.put(`https://vouchers-backend.vercel.app/vouchers/${form.id}`, finalForm)
        .then(() => {
          alert('Transaction updated successfully!');
          navigate('/');
        })
        .catch((err) => {
          console.error('Update error:', err);
          const errorMessage = err.response?.data?.error || 'Failed to update transaction.';
          alert(`Error: ${errorMessage}`);
        });
    } else {
      axios.post('https://vouchers-backend.vercel.app/vouchers', finalForm)
        .then(() => {
          // Add new category and name to dropdowns if they were custom
          if (finalForm.category === customCategory && !categories.includes(customCategory)) {
            setCategories([...categories, customCategory]);
          }
          if (finalForm.name === customName && !names.includes(customName)) {
            setNames([...names, customName]);
          }
          alert('Transaction saved successfully!');
          navigate('/');
        })
        .catch((err) => {
          console.error('Save error:', err);
          const errorMessage = err.response?.data?.error || 'Failed to save transaction.';
          alert(`Error: ${errorMessage}`);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
        {isEdit ? 'Edit Transaction' : 'Add Transaction'}
      </h1>
      <div className="w-11/12 max-w-lg bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Voucher Number</label>
            <input
              type="text"
              name="voucherNumber"
              value={form.voucherNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Voucher Number"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date (DD/MM/YYYY)</label>
            <input
              type="text"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., 15/03/2025"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <select
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Name</option>
              {names.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {form.name === 'Other' && (
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter new name"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bank</label>
            <input
              type="text"
              name="bank"
              value={form.bank}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Bank Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Cheque Number</label>
            <input
              type="text"
              name="chequeNumber"
              value={form.chequeNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Cheque Number (optional)"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Amount"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {form.category === 'Other' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter new category"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Month</label>
            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Year (e.g., 2025)"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;