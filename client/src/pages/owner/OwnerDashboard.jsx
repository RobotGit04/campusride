import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const Footer = () => (
  <footer className="w-full py-12 border-t border-[#dbe3f1] bg-[#f8f9ff]">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
      <div>
        <span className="font-headline font-bold text-primary-container text-xl block mb-2">CampusRide VIT AP</span>
        <p className="font-body text-xs uppercase tracking-widest text-slate-500">© 2025 CampusRide VIT AP. Scholarly Kinetic Excellence.</p>
      </div>
      <div className="flex flex-wrap gap-6 md:justify-end">
        {['Terms of Service', 'Privacy Policy', 'Campus Map', 'Contact Security'].map(link => (
          <a key={link} href="#"
            className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-primary-container underline decoration-2 underline-offset-4 transition-all opacity-80 hover:opacity-100">
            {link}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default function OwnerListings() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'CYCLE', description: '', pricePerDay: '', deposit: ''
  });
  const [photos, setPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

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

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(files[0]);
    }
  };

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
      toast.success('Bike listed successfully!');
      setShowForm(false);
      setForm({ name: '', type: 'CYCLE', description: '', pricePerDay: '', deposit: '' });
      setPhotos([]);
      setPhotoPreview(null);
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
      toast.success('Status updated!');
      fetchBikes();
    } catch {
      toast.error('Failed to update');
    }
  };

  const typeLabels = { CYCLE: 'Cycle', SCOOTER: 'Scooter', MOPED: 'Moped' };

  return (
    <div className="bg-background font-body text-on-background min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold font-headline text-primary tracking-tight mb-2">
              My Bikes
            </h1>
            <p className="text-on-surface-variant text-lg max-w-md">
              Manage your academic fleet and monitor real-time availability across campus hubs.
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95"
            style={{ boxShadow: '0 4px 16px rgba(0,81,213,0.2)' }}>
            <span className="material-symbols-outlined">add_circle</span>
            {showForm ? 'Cancel' : 'List a bike'}
          </button>
        </header>

        {showForm && (
          <section className="mb-16 bg-surface-container-low p-8 rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-headline text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">directions_bike</span>
                Add New Listing
              </h2>
              <button onClick={() => setShowForm(false)}
                className="text-secondary font-semibold text-sm uppercase tracking-widest hover:underline">
                Collapse
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface ml-1">Bike Name</label>
                  <input placeholder="e.g. Blue Speedster 500"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="bg-surface-container-highest border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"/>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface ml-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="bg-surface-container-highest border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary/20 transition-all outline-none">
                    <option value="CYCLE">Cycle</option>
                    <option value="SCOOTER">Scooter</option>
                    <option value="MOPED">Moped</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-on-surface ml-1">Description</label>
                  <textarea placeholder="Describe condition, lock type, and specific pickup instructions..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required
                    rows={4}
                    className="bg-surface-container-highest border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none resize-none"/>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface ml-1">Price per day (₹)</label>
                  <input type="number" placeholder="299"
                    value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} required
                    className="bg-surface-container-highest border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"/>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface ml-1">Security Deposit (₹)</label>
                  <input type="number" placeholder="500"
                    value={form.deposit} onChange={e => setForm({ ...form, deposit: e.target.value })} required
                    className="bg-surface-container-highest border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"/>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-on-surface ml-1">Bike Photo</label>
                <label className="h-full min-h-[200px] border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center bg-white/50 hover:bg-white transition-colors cursor-pointer group overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview"
                      className="w-full h-full object-cover rounded-xl"/>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-secondary transition-colors">
                        cloud_upload
                      </span>
                      <p className="text-xs text-on-surface-variant mt-2 font-medium">
                        Drop image or click to upload
                      </p>
                    </>
                  )}
                  <input type="file" multiple accept="image/*"
                    onChange={handlePhotoChange} className="hidden"/>
                </label>
              </div>

              <div className="md:col-span-3 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 font-semibold text-on-surface-variant hover:text-primary transition-colors">
                  Discard
                </button>
                <button type="submit" disabled={submitting}
                  className="bg-primary text-white px-10 py-3 rounded-md font-bold hover:bg-primary-container transition-all disabled:opacity-60">
                  {submitting ? 'Listing...' : 'Submit Listing'}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading your bikes...</div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            No bikes listed yet. Click "List a bike" to get started.
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bikes.map(bike => (
              <article key={bike.id}
                className="bg-surface-container-lowest rounded-[14px] overflow-hidden group hover:shadow-2xl transition-all duration-300"
                style={{ boxShadow: '0 2px 8px rgba(12,30,61,0.05)' }}>
                <div className="p-4 relative">
                  {bike.photos?.[0] ? (
                    <img src={bike.photos[0]} alt={bike.name}
                      className="w-full h-56 object-cover rounded-xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"/>
                  ) : (
                    <div className="w-full h-56 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-outline-variant">
                        directions_bike
                      </span>
                    </div>
                  )}
                  <div className={`absolute top-6 right-6 px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg ${
                    bike.isAvailable ? 'bg-green-500' : 'bg-on-surface-variant'
                  }`}>
                    {bike.isAvailable && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>
                    )}
                    {bike.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">
                        {typeLabels[bike.type]}
                      </p>
                      <h3 className="text-xl font-bold font-headline text-primary">{bike.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold font-headline text-primary">
                        ₹{bike.pricePerDay}
                        <span className="text-xs text-on-surface-variant font-medium">/day</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant font-semibold">
                        Active Status
                      </span>
                      <span className={`text-sm font-bold ${
                        bike.isAvailable ? 'text-on-surface' : 'text-on-surface-variant'
                      }`}>
                        {bike.isAvailable ? 'Listed' : 'Unavailable'}
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer"
                        checked={bike.isAvailable}
                        onChange={() => handleToggleAvailable(bike)}/>
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"/>
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}