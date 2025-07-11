
// pages/admin/locations-approval.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Set up the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LocationsApproval() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data || []);
    }
  };

  const toggleApproval = async (id: number, approved: boolean) => {
    await supabase.from("locations").update({ approved: !approved }).eq("id", id);
    fetchLocations();
  };

  const toggleFeatured = async (id: number, featured: boolean) => {
    await supabase.from("locations").update({ featured: !featured }).eq("id", id);
    fetchLocations();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🗂 Admin: Approve & Feature Locations</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border">Name</th>
            <th className="text-center p-2 border">Approved</th>
            <th className="text-center p-2 border">Featured</th>
            <th className="text-center p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc: any) => (
            <tr key={loc.id} className="border-t">
              <td className="p-2">{loc.name}</td>
              <td className="text-center">{loc.approved ? "✅" : "❌"}</td>
              <td className="text-center">{loc.featured ? "⭐" : "—"}</td>
              <td className="text-center space-x-2">
                <button
                  onClick={() => toggleApproval(loc.id, loc.approved)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  {loc.approved ? "Unapprove" : "Approve"}
                </button>
                <button
                  onClick={() => toggleFeatured(loc.id, loc.featured)}
                  className="bg-yellow-500 text-black px-2 py-1 rounded"
                >
                  {loc.featured ? "Unfeature" : "Feature"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
