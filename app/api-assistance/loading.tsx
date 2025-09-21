import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading API Documentation...</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
