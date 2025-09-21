"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function EncouragementMessagePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMessage() {
      setLoading(true);
      setError(null);
      try {
        // Call your API endpoint for encouragement (replace with real endpoint if available)
        const response = await fetch("/api/encouragement-message", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch message");
        const data = await response.json();
        setMessage(data.message || "You are doing great! Keep moving forward—your efforts matter and you have what it takes to succeed.");
      } catch (err) {
        setMessage("You are doing great! Keep moving forward—your efforts matter and you have what it takes to succeed.");
      } finally {
        setLoading(false);
      }
    }
    fetchMessage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-xl w-full shadow-lg">
        <CardHeader>
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-green-700">Ask AI Legal</span>
          </div>
          <CardTitle className="text-green-700 text-2xl text-center">A Message of Encouragement</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="animate-spin mr-2" /> Generating your message...
            </div>
          ) : (
            <div className="text-lg text-center text-gray-800 py-8">{message}</div>
          )}
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => router.push('/')}>Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 