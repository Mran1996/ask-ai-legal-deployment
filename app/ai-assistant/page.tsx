"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLegalAssistant } from "@/components/context/legal-assistant-context"

// Update the component to include validation and tooltips
export default function AIAssistantPage() {
  const router = useRouter()
  const { userInfo, setUserInfo } = useLegalAssistant()
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    category: false,
  })

  const handleContinue = () => {
    // Validate inputs
    const newErrors = {
      firstName: !userInfo.firstName.trim(),
      lastName: !userInfo.lastName.trim(),
      category: !userInfo.category,
    }

    setErrors(newErrors)

    // Only proceed if all required fields are filled
    if (!newErrors.firstName && !newErrors.lastName && !newErrors.category) {
      // Store in localStorage
      localStorage.setItem("firstName", userInfo.firstName)
      localStorage.setItem("lastName", userInfo.lastName)
      localStorage.setItem("legalCategory", userInfo.category)
      router.push("/ai-assistant/step-1")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-emerald-500 text-white py-8 md:py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Ask AI Legal – AI-Powered Legal Assistant</h1>
            <p className="text-lg md:text-xl mt-2">Get professional legal help in minutes</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-screen-sm mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-600">Step 1 of 5: Basic Information</span>
            <span className="text-xs md:text-sm font-medium text-gray-600">20%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "20%" }}></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-screen-sm mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold">Ask AI Legal – AI-Powered Legal Assistant</h2>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Get professional legal help in minutes</p>
            </div>

            {/* Selected Category Label */}
            {userInfo.category && (
              <div className="text-xs md:text-sm text-gray-600 mt-4 mb-2 italic">
                Selected Category: <span className="font-semibold not-italic text-emerald-700">{userInfo.category.charAt(0).toUpperCase() + userInfo.category.slice(1)}</span>
              </div>
            )}

            {/* Name Section */}
            <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-gray-100">

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className={`w-full ${errors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
                    value={userInfo.firstName}
                    onChange={(e) => {
                      setUserInfo((prev) => ({ ...prev, firstName: e.target.value }))
                      if (e.target.value.trim()) {
                        setErrors((prev) => ({ ...prev, firstName: false }))
                      }
                    }}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">First name is required</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    className={`w-full ${errors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
                    value={userInfo.lastName}
                    onChange={(e) => {
                      setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))
                      if (e.target.value.trim()) {
                        setErrors((prev) => ({ ...prev, lastName: false }))
                      }
                    }}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">Last name is required</p>}
                </div>
              </div>
            </div>

            {/* Legal Help Type Section */}
            <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <h3 className="text-base md:text-lg font-medium">What type of legal help do you need?</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-2 text-gray-400 hover:text-gray-600">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">
                        Selecting a category helps us provide the most relevant legal assistance
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {errors.category && <p className="mb-4 text-sm text-red-500">Please select a legal category</p>}

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {/* Housing - TEMPORARILY HIDDEN */}
                {/* <div
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                    userInfo.category === "housing"
                      ? "border-emerald-500 bg-emerald-50"
                      : errors.category
                        ? "border-red-200"
                        : ""
                  }`}
                  onClick={() => {
                    setUserInfo((prev) => ({ ...prev, category: "housing" }))
                    setErrors((prev) => ({ ...prev, category: false }))
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span role="img" aria-label="Housing" className="text-xl md:text-2xl">
                        🏠
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Housing</h4>
                      <p className="text-xs md:text-sm text-gray-600">Eviction, repairs, lease issues</p>
                    </div>
                  </div>
                </div> */}

                {/* Family - TEMPORARILY HIDDEN */}
                {/* <div
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                    userInfo.category === "family"
                      ? "border-emerald-500 bg-emerald-50"
                      : errors.category
                        ? "border-red-200"
                        : ""
                  }`}
                  onClick={() => {
                    setUserInfo((prev) => ({ ...prev, category: "family" }))
                    setErrors((prev) => ({ ...prev, category: false }))
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span role="img" aria-label="Family" className="text-xl md:text-2xl">
                        👪
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Family</h4>
                      <p className="text-xs md:text-sm text-gray-600">Divorce, custody, child support</p>
                    </div>
                  </div>
                </div> */}

                {/* Employment - TEMPORARILY HIDDEN */}
                {/* <div
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                    userInfo.category === "employment"
                      ? "border-emerald-500 bg-emerald-50"
                      : errors.category
                        ? "border-red-200"
                        : ""
                  }`}
                  onClick={() => {
                    setUserInfo((prev) => ({ ...prev, category: "employment" }))
                    setErrors((prev) => ({ ...prev, category: false }))
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span role="img" aria-label="Employment" className="text-xl md:text-2xl">
                        💼
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Employment</h4>
                      <p className="text-xs md:text-sm text-gray-600">Discrimination, termination, benefits</p>
                    </div>
                  </div>
                </div> */}

                {/* Civil */}
                <div
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                    userInfo.category === "civil"
                      ? "border-emerald-500 bg-emerald-50"
                      : errors.category
                        ? "border-red-200"
                        : ""
                  }`}
                  onClick={() => {
                    setUserInfo((prev) => ({ ...prev, category: "civil" }))
                    setErrors((prev) => ({ ...prev, category: false }))
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span role="img" aria-label="Civil" className="text-xl md:text-2xl">
                        📚
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Civil</h4>
                      <p className="text-xs md:text-sm text-gray-600">Lawsuits, disputes, settlements</p>
                    </div>
                  </div>
                </div>

                {/* Immigration - TEMPORARILY HIDDEN */}
                {/* <div
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                    userInfo.category === "immigration"
                      ? "border-emerald-500 bg-emerald-50"
                      : errors.category
                        ? "border-red-200"
                        : ""
                  }`}
                  onClick={() => {
                    setUserInfo((prev) => ({ ...prev, category: "immigration" }))
                    setErrors((prev) => ({ ...prev, category: false }))
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span role="img" aria-label="Immigration" className="text-xl md:text-2xl">
                        🌎
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Immigration</h4>
                      <p className="text-xs md:text-sm text-gray-600">Visa, residency, citizenship</p>
                    </div>
                  </div>
                </div> */}

                {/* Criminal */}
                <div
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                    userInfo.category === "criminal"
                      ? "border-emerald-500 bg-emerald-50"
                      : errors.category
                        ? "border-red-200"
                        : ""
                  }`}
                  onClick={() => {
                    setUserInfo((prev) => ({ ...prev, category: "criminal" }))
                    setErrors((prev) => ({ ...prev, category: false }))
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span role="img" aria-label="Criminal" className="text-xl md:text-2xl">
                        ⚖️
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Criminal</h4>
                      <p className="text-xs md:text-sm text-gray-600">Defense, charges, rights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Fields Note */}
            <div className="text-xs md:text-sm text-gray-500 mb-4">
              <span className="text-red-500">*</span> Required fields
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <Button
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
