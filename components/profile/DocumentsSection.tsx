import { User } from "@/types/user";

interface DocumentsSectionProps {
  user: User;
}

export default function DocumentsSection({ user }: DocumentsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Documents</h3>
        <p className="text-sm text-gray-500">Manage your uploaded documents and files.</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Upload Documents</h4>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Upload New
            </button>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
            <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Recent Documents</h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">No documents uploaded yet</p>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Storage Usage</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">0 MB used of 100 MB</p>
        </div>
      </div>
    </div>
  );
} 