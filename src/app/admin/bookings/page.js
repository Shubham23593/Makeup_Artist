"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Edit2, Trash2, List, Calendar as CalendarIcon } from "lucide-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("calendar"); // "list" | "calendar"

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Booking ${status}`);
        fetchBookings();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating booking");
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Booking deleted");
        fetchBookings();
      }
    } catch (err) {
      toast.error("Error deleting booking");
    }
  };

  const filteredBookings = bookings.filter((b) => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-amber-100 text-amber-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Completed": return "bg-gray-200 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Convert bookings for calendar display
  const calendarEvents = bookings.map(b => {
    // b.date is string "YYYY-MM-DD", b.time might be "10:00 AM"
    // We convert it to a Date object using moment
    const startObj = moment(`${b.date} ${b.time}`, "YYYY-MM-DD hh:mm A").toDate();
    const endObj = moment(startObj).add(2, 'hours').toDate(); // rough estimate 2 hours
    return {
      id: b._id,
      title: `${b.name} - ${b.service}`,
      start: startObj,
      end: endObj,
      resource: b,
      status: b.status
    }
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.status === 'Confirmed') backgroundColor = '#16a34a';
    if (event.status === 'Pending') backgroundColor = '#d97706';
    if (event.status === 'Cancelled') backgroundColor = '#dc2626';
    if (event.status === 'Completed') backgroundColor = '#4b5563';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px'
      }
    };
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#2A2522]">Booking Management</h1>
          <p className="text-gray-500 mt-1">Review and manage client appointments.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md outline-none focus:border-[#C8A97E] w-56"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white rounded-md border border-gray-200 p-1">
            <button 
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-sm transition-colors ${viewMode === "calendar" ? "bg-[#F3EBE5] text-[#C8A97E]" : "text-gray-400 hover:text-gray-700"}`}
              title="Calendar View"
            >
              <CalendarIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-sm transition-colors ${viewMode === "list" ? "bg-[#F3EBE5] text-[#C8A97E]" : "text-gray-400 hover:text-gray-700"}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        {viewMode === "calendar" ? (
           <div className="p-4 flex-1">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 650 }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => alert(`Client: ${event.resource.name}\nService: ${event.resource.service}\nStatus: ${event.resource.status}\nPhone: ${event.resource.phone}`)}
              />
           </div>
        ) : (
          <div className="overflow-x-auto p-0">
            <table className="w-full text-left border-collapse cursor-default">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-[#2A2522]">{b.name}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>{b.email}</div>
                      <div>{b.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="font-medium">{b.date}</div>
                      <div>{b.time}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 truncate max-w-[150px]">{b.service}</td>
                    <td className="p-4">
                      <select 
                        value={b.status}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-none outline-none cursor-pointer font-medium ${getStatusColor(b.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-3 items-center">
                      <a 
                        href={`https://wa.me/${b.phone.startsWith("+") ? b.phone.replace("+", "") : "91" + b.phone}?text=Hello ${encodeURIComponent(b.name)},%0A%0AGreat news! Your Deepali Makeup Artist booking for ${encodeURIComponent(b.service)} on ${b.date} at ${b.time} has been Confirmed.%0A%0AWe look forward to seeing you!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600 transition-colors"
                        title="Send WhatsApp Confirmation"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.295-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                      <button onClick={() => deleteBooking(b._id)} className="text-gray-400 hover:text-red-500" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 font-serif italic text-lg">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
