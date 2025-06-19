"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching session:", err)
          setLoading(false)
        })
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. We'll be in touch within 24 hours to get started on your project.
        </p>

        {session && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">Service: {session.metadata?.service_name}</p>
            <p className="text-sm text-gray-600">Email: {session.customer_email}</p>
            <p className="text-sm text-gray-600">Amount: ${(session.amount_total / 100).toFixed(2)}</p>
          </div>
        )}

        <Button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          Back to Home
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
