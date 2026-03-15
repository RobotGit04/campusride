import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

export default function OwnerListings() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'CYCLE', description: '', pricePerDay: '', deposit: ''
  });
  const [photos, setPhotos] = useState([]);

  const fetchBikes = async () => {
    try {
      const res = await api.get('/bikes/owner/my-bikes');
      setBikes(res.data);
    } catch {
      toast.error('Failed to load bikes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      photos.forEach(photo => formData.append('photos', photo));

      await api.post('/bikes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Bike listed!');
      setShowForm(false);
      setForm({ name: '', type: 'CYCLE', description: '', pricePerDay: '', deposit: '' });
      setPhotos([]);
      fetchBikes();
    } catch {
      toast.error('Failed to list bike');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailable = async (bike) => {
    try {
      await api.put(`/bikes/${bike.id}`, {
        isAvailable: (!bike.isAvailable).toString()
      });
      toast.success('Updated!');
      fetchBikes();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bikes</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ List a bike'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">New listing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Bike name" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <select name="type" value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="CYCLE">Cycle</option>
                  <option value="SCOOTER">Scooter</option>
                  <option value="MOPED">Moped</option>
                </select>
              </div>

              <textarea name="description" placeholder="Description" value={form.description}
                onChange={e => setForm({...form, description: e.target.value})} required rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price per day (₹)" value={form.pricePerDay}
                  onChange={e => setForm({...form, pricePerDay: e.target.value})} required
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="number" placeholder="Deposit amount (₹)" value={form.deposit}
                  onChange={e => setForm({...form, deposit: e.target.value})} required
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Photos (up to 5)</label>
                <input type="file" multiple accept="image/*"
                  onChange={e => setPhotos(Array.from(e.target.files))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"/>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 disabled:opacity-50">
                {submitting ? 'Listing...' : 'List bike'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No bikes listed yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bikes.map(bike => (
              <div key={bike.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  {bike.photos?.[0] ? (
                    <img src={bike.photos[0]} alt={bike.name}
                      className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No photo
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{bike.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{bike.type.toLowerCase()}</p>
                  <p className="text-blue-600 font-medium mt-1">₹{bike.pricePerDay}/day</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bike.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bike.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <button onClick={() => handleToggleAvailable(bike)}
                      className="text-xs text-gray-500 hover:text-blue-600 underline">
                      Toggle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}