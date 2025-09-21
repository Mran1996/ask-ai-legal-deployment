"use client";

const documents = [
  {
    name: "Wage Dispute Demand Letter",
    date: "2024-04-28",
    url: "/documents/wage-dispute-letter.pdf",
  },
  {
    name: "Eviction Response - King County",
    date: "2024-04-20",
    url: "/documents/eviction-response.pdf",
  },
];

export default function DocumentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Documents</h1>
      <div className="border rounded-xl p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Downloadable Documents</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Download</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2 pr-4">{doc.name}</td>
                  <td className="py-2 pr-4">{doc.date}</td>
                  <td className="py-2 pr-4">
                    <a href={doc.url} className="text-blue-600 underline" download>
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 