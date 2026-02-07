import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Folder, Layers, Package, Image as ImageIcon, Loader2 } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/catalog`;

const ProductManager = () => {
    // State: view = 'categories' | 'services' | 'products'
    const [view, setView] = useState('categories');
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    // Data State
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Selection State
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null); // For main image
    const [galleryFiles, setGalleryFiles] = useState(null); // For product gallery
    const topRef = React.useRef(null);

    // Search State
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Handle Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim()) {
                setIsSearching(true);
                try {
                    const res = await axios.get(`${API_BASE}/products?search=${searchTerm}&_t=${Date.now()}`);
                    setSearchResults(res.data);
                } catch (err) {
                    console.error("Search failed:", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Fetch Categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/categories?_t=${Date.now()}`);
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            alert("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Services
    const fetchServices = async (catId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/services?categoryId=${catId}&_t=${Date.now()}`);
            setServices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Products
    const fetchProducts = async (servId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/products?serviceId=${servId}&_t=${Date.now()}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchCategories();
    }, []);

    // Navigation Handlers
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setView('services');
        setBreadcrumbs([{ name: 'Categories', view: 'categories' }, { name: cat.name, view: 'services' }]);
        fetchServices(cat._id);
    };

    const handleServiceClick = (serv) => {
        setSelectedService(serv);
        setView('products');
        setBreadcrumbs([...breadcrumbs, { name: serv.name, view: 'products' }]);
        fetchProducts(serv._id);
    };

    const handleBack = () => {
        if (view === 'products') {
            setView('services');
            setSelectedService(null);
            setBreadcrumbs(breadcrumbs.slice(0, 2));
            fetchServices(selectedCategory._id);
        } else if (view === 'services') {
            setView('categories');
            setSelectedCategory(null);
            setBreadcrumbs([]);
            fetchCategories();
        }
    };

    // State for Editing
    const [editItem, setEditItem] = useState(null);

    // Form Handlers
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleGalleryChange = (e) => {
        setGalleryFiles(e.target.files);
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            description: item.description || "",
            originalPrice: item.originalPrice || "",
            discountedPrice: item.discountedPrice || "",
            features: item.features ? item.features.join(", ") : "",
            video: item.video || ""
        });
        setShowForm(true);
        setShowForm(true);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCreate = () => {
        setEditItem(null);
        setFormData({});
        setShowForm(true);
        setShowForm(true);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        // Append common fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Append Image
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editItem) {
                // EDIT MODE
                const url = `${API_BASE}/${view}/${editItem._id}`;
                // For gallery updates
                if (view === 'products' && galleryFiles) {
                    for (let i = 0; i < galleryFiles.length; i++) {
                        data.append('gallery', galleryFiles[i]);
                    }
                }
                await axios.put(url, data);
            } else {
                // CREATE MODE
                if (view === 'categories') {
                    await axios.post(`${API_BASE}/categories`, data);
                } else if (view === 'services') {
                    data.append('categoryId', selectedCategory._id);
                    await axios.post(`${API_BASE}/services`, data);
                } else if (view === 'products') {
                    data.append('serviceId', selectedService._id);
                    if (galleryFiles) {
                        for (let i = 0; i < galleryFiles.length; i++) {
                            data.append('gallery', galleryFiles[i]);
                        }
                    }
                    await axios.post(`${API_BASE}/products`, data);
                }
            }

            // Refresh Data
            if (view === 'categories') fetchCategories();
            else if (view === 'services') fetchServices(selectedCategory._id);
            else if (view === 'products') fetchProducts(selectedService._id);

            setShowForm(false);
            setFormData({});
            setImageFile(null);
            setGalleryFiles(null);
            setEditItem(null);
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Failed to save. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            await axios.delete(`${API_BASE}/${type}/${id}`);
            if (type === 'categories') fetchCategories();
            if (type === 'services') fetchServices(selectedCategory._id);
            if (type === 'products') fetchProducts(selectedService._id);
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <div ref={topRef} className="bg-white rounded-xl border p-6 shadow-sm min-h-[500px]">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col gap-4 mb-6 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {view !== 'categories' && !searchTerm && (
                            <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <span
                            className={`cursor-pointer ${view === 'categories' && !searchTerm ? 'font-bold text-black' : ''}`}
                            onClick={() => { setView('categories'); setBreadcrumbs([]); setSelectedCategory(null); setSelectedService(null); setSearchTerm(""); fetchCategories(); }}
                        >
                            Categories
                        </span>
                        {selectedCategory && !searchTerm && (
                            <>
                                <span>/</span>
                                <span
                                    className={`cursor-pointer ${view === 'services' ? 'font-bold text-black' : ''}`}
                                    onClick={() => { setView('services'); setBreadcrumbs(breadcrumbs.slice(0, 2)); setSelectedService(null); fetchServices(selectedCategory._id) }}
                                >
                                    {selectedCategory.name}
                                </span>
                            </>
                        )}
                        {selectedService && !searchTerm && (
                            <>
                                <span>/</span>
                                <span className="font-bold text-black">{selectedService.name}</span>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input
                            placeholder="Search products..."
                            className="border rounded-lg px-3 py-1 text-sm w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-[#DB2A7B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#c21f6a]"
                        >
                            <Plus size={16} />
                            Add {view === 'categories' ? 'Category' : view === 'services' ? 'Service' : 'Product'}
                        </button>
                    </div>
                </div>

                {/* Search Results Mode */}
                {searchTerm && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2">Search Results</h3>
                        {searchResults.length === 0 ? (
                            <p className="text-gray-500 text-sm">No products found matching "{searchTerm}"</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.map(prod => (
                                    <div key={prod._id} className="group relative border rounded-xl overflow-hidden hover:shadow-md transition bg-white">
                                        <div className="flex p-2 gap-3 items-center">
                                            {prod.image ? (
                                                <div className="w-16 h-16 bg-gray-100 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${prod.image})` }} />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-300 rounded-lg"><Package size={20} /></div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{prod.name}</h4>
                                                <div className="flex gap-2 items-center text-xs">
                                                    <span className="font-bold text-[#DB2A7B]">₹{prod.discountedPrice}</span>
                                                    <span className="text-gray-400">{prod.serviceId?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setView('products'); // Ensure view is products for edit submit to work
                                                    openEditModal(prod);
                                                }}
                                                className="p-2 bg-white/80 rounded-full text-blue-600 hover:bg-white border shadow-sm"
                                            >
                                                <Layers size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* FORM AREA */}
            {showForm && (
                <div className="mb-8 bg-gray-50 p-6 rounded-xl border">
                    <h3 className="text-lg font-bold mb-4">{editItem ? 'Edit Item' : 'Add New Item'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name"
                                value={formData.name || ""}
                                placeholder="Name"
                                className="border p-2 rounded"
                                required
                                onChange={handleInputChange}
                            />
                            {view === 'products' && (
                                <>
                                    <input name="originalPrice" value={formData.originalPrice || ""} type="number" placeholder="Original Price" className="border p-2 rounded" onChange={handleInputChange} />
                                    <input name="discountedPrice" value={formData.discountedPrice || ""} type="number" placeholder="Discounted Price" className="border p-2 rounded" onChange={handleInputChange} />
                                </>
                            )}
                        </div>

                        {(view === 'services' || view === 'products') && (
                            <textarea
                                name="description"
                                value={formData.description || ""}
                                placeholder="Description"
                                className="border p-2 rounded w-full"
                                rows="3"
                                onChange={handleInputChange}
                            />
                        )}

                        {view === 'products' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    name="features"
                                    value={formData.features || ""}
                                    placeholder="Features (comma separated)"
                                    className="border p-2 rounded w-full"
                                    onChange={handleInputChange}
                                />
                                <input
                                    name="video"
                                    value={formData.video || ""}
                                    placeholder="Video URL (e.g., /videos/example.mp4)"
                                    className="border p-2 rounded w-full"
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold mb-1">Main Image</label>
                                <input type="file" onChange={handleFileChange} className="text-sm" />
                                {editItem && editItem.image && <p className="text-xs text-blue-500 mt-1">Has existing image</p>}
                            </div>
                            {view === 'products' && (
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold mb-1">Gallery Images</label>
                                    <input type="file" multiple onChange={handleGalleryChange} className="text-sm" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#02192F] text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                {loading && <Loader2 size={14} className="animate-spin" />}
                                {editItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* LIST AREA */}
            {loading && !showForm ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* CATEGORIES LIST */}
                    {view === 'categories' && categories.map(cat => (
                        <div key={cat._id} className="group relative border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition bg-white" onClick={() => handleCategoryClick(cat)}>
                            {cat.image ? (
                                <div className="h-32 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${cat.image})` }} />
                            ) : (
                                <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={32} /></div>
                            )}
                            <div className="p-4">
                                <h4 className="font-bold text-gray-800">{cat.name}</h4>
                            </div>
                            {/* ACTION BUTTONS (HOVER) */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openEditModal(cat); }}
                                    className="p-2 bg-white/80 rounded-full text-blue-600 hover:bg-white"
                                >
                                    <Layers size={16} /> {/* Using Layers as Edit icon temporarily or import Pencil */}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(cat._id, 'categories'); }}
                                    className="p-2 bg-white/80 rounded-full text-red-500 hover:bg-white"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* SERVICES LIST */}
                    {view === 'services' && services.map(srv => (
                        <div key={srv._id} className="group relative border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition bg-white" onClick={() => handleServiceClick(srv)}>
                            {srv.image ? (
                                <div className="h-32 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${srv.image})` }} />
                            ) : (
                                <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-300"><Layers size={32} /></div>
                            )}
                            <div className="p-4">
                                <h4 className="font-bold text-gray-800">{srv.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{srv.description}</p>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openEditModal(srv); }}
                                    className="p-2 bg-white/80 rounded-full text-blue-600 hover:bg-white"
                                >
                                    <Layers size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(srv._id, 'services'); }}
                                    className="p-2 bg-white/80 rounded-full text-red-500 hover:bg-white"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* PRODUCTS LIST */}
                    {view === 'products' && products.map(prod => (
                        <div key={prod._id} className="group relative border rounded-xl overflow-hidden hover:shadow-md transition bg-white">
                            {prod.image ? (
                                <div className="h-40 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${prod.image})` }} />
                            ) : (
                                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-300"><Package size={32} /></div>
                            )}
                            <div className="p-4">
                                <h4 className="font-bold text-gray-800">{prod.name}</h4>
                                <div className="flex gap-2 items-center mt-1">
                                    <span className="font-bold text-[#DB2A7B]">₹{prod.discountedPrice}</span>
                                    {prod.originalPrice && <span className="text-xs text-gray-400 line-through">₹{prod.originalPrice}</span>}
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openEditModal(prod); }}
                                    className="p-2 bg-white/80 rounded-full text-blue-600 hover:bg-white"
                                >
                                    <Layers size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(prod._id, 'products'); }}
                                    className="p-2 bg-white/80 rounded-full text-red-500 hover:bg-white"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* EMPTY STATES */}
                    {view === 'categories' && categories.length === 0 && !loading && (
                        <div className="col-span-full text-center py-10 text-gray-400">No categories found. Add one to get started.</div>
                    )}
                    {view === 'services' && services.length === 0 && !loading && (
                        <div className="col-span-full text-center py-10 text-gray-400">No services found in this category.</div>
                    )}
                    {view === 'products' && products.length === 0 && !loading && (
                        <div className="col-span-full text-center py-10 text-gray-400">No products found in this service.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductManager;
