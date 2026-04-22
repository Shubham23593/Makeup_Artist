"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, Trash2, Loader2, RefreshCcw } from "lucide-react";

// Portfolio slots: upload to a specific numbered position
const PORTFOLIO_SLOTS = [
  ...[1,2,3,4,5,6,7,8].map(n => `Portfolio: Bridal ${n}`),
  ...[1,2,3,4].map(n => `Portfolio: Party ${n}`),
  ...[1,2,3,4].map(n => `Portfolio: Photoshoot ${n}`),
];

const CATEGORIES = [
  "About Section",
  "Slider 1 (Bridal Makeup)",
  "Slider 2 (HD Makeup)",
  "Slider 3 (Engagement Makeup)",
  "Slider 4 (Party Makeup)",
  "Service: Bridal Makeup",
  "Service: Party Makeup",
  "Service: Baby Shower",
  "Service: HD Makeup",
  "Service: Pre-Weeding Makeup",
  "Service: Engagement Makeup",
  ...PORTFOLIO_SLOTS,
  "Before & After 1 (Before)",
  "Before & After 1 (After)",
  "Before & After 2 (Before)",
  "Before & After 2 (After)",
  "Testimonials",
  "Other"
];

export default function AdminImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (err) {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    setUploading(true);
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      // 2. Save site image config
      const imageConfig = {
        category: selectedCategory,
        title: title || selectedCategory,
        imageUrl: uploadData.url,
        publicId: uploadData.public_id,
        displayOrder: images.filter(img => img.category === selectedCategory).length
      };

      const saveRes = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageConfig),
      });

      if (saveRes.ok) {
        toast.success("Image uploaded successfully");
        setFile(null);
        setTitle("");
        fetchImages();
      } else {
        throw new Error("Failed to save image configuration");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this image? It will immediately stop showing on the website.")) return;
    try {
      const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Image removed");
        fetchImages();
      } else {
         toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#2A2522]">Dynamic Image Management</h1>
        <p className="text-gray-500 mt-1">Upload and manage images displayed across the website.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-[#2A2522] mb-4 border-b pb-2">Upload New Image</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="field-label">Category (Section)</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md outline-none focus:border-[#C8A97E]"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Image Title / Description (Optional)</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md outline-none focus:border-[#C8A97E]"
                placeholder="e.g. Bridal Hero Image"
              />
            </div>
          </div>
          
          <div className="space-y-4 flex flex-col justify-end">
            <div>
              <label className="field-label">Select Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-2 border border-gray-200 rounded-md outline-none focus:border-[#C8A97E] text-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={uploading} 
              className="px-4 py-2 bg-[#2A2522] text-[#FBF9F6] rounded-md hover:bg-[#C8A97E] transition-colors flex items-center justify-center gap-2 mt-auto disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              <span>{uploading ? "Uploading..." : "Upload & Publish"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Sections */}
      <div className="space-y-8">
        {CATEGORIES.map(category => {
          const categoryImages = images.filter(img => img.category === category);
          if (categoryImages.length === 0) return null;

          return (
            <div key={category} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif text-[#2A2522] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8A97E]"></span>
                {category}
                <span className="ml-auto text-sm font-sans font-medium bg-[#F3EBE5] text-[#C8A97E] px-2 py-0.5 rounded-full">
                  {categoryImages.length} {categoryImages.length === 1 ? "image" : "images"}
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryImages.map((img, idx) => (
                  <div key={img._id} className="relative group rounded-md overflow-hidden border border-gray-200 aspect-[4/5]">
                    <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                    {/* Image number badge */}
                    <div className="absolute top-2 left-2 bg-[#2A2522]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      #{idx + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <p className="text-white text-xs truncate drop-shadow-md">{img.title}</p>
                      <button 
                        onClick={() => handleDelete(img._id)}
                        className="self-end p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {images.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 font-serif text-xl italic">
          No images uploaded yet.
        </div>
      )}
    </div>
  );
}
