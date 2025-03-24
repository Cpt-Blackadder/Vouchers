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
  const [banks, setBanks] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch unique categories, names, and banks when the component mounts
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

    const fetchBanks = async () => {
      try {
        const res = await axios.get('https://vouchers-backend.vercel.app/banks');
        setBanks(res.data);
      } catch (err) {
        console.error('Error fetching banks:', err);
      }
    };

    fetchCategories();
    fetchNames();
    fetchBanks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Saving form data:', form);
    if (!form.voucherNumber || !form.date || !form.name || !form.bank || !form.amount || !form.category || !form.month || !form.year) {
      alert('Please fill in all required fields (Voucher Number, Date, Name, Bank, Amount, Category, Month, Year).');
      return;
    }

    if (isEdit) {
      axios.put(`https://vouchers-backend.vercel.app/vouchers/${form.id}`, form)
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
      axios.post('https://vouchers-backend.vercel.app/vouchers', form)
        .then(() => {
          // Add new category, name, and bank to dropdowns if they are new
          if (!categories.includes(form.category)) {
            setCategories([...categories, form.category]);
          }
          if (!names.includes(form.name)) {
            setNames([...names, form.name]);
          }
          if (!banks.includes(form.bank)) {
            setBanks([...banks, form.bank]);
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
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              list="namesList"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter or select a name"
            />
            <datalist id="namesList">
              {names.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bank</label>
            <input
              type="text"
              name="bank"
              value={form.bank}
              onChange={handleChange}
              list="banksList"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter or select a bank"
            />
            <datalist id="banksList">
              {banks.map((bank) => (
                <option key={bank} value={bank} />
              ))}
            </datalist>
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
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              list="categoriesList"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter or select a category"
            />
            <datalist id="categoriesList">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
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