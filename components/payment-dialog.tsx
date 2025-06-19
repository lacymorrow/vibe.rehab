"use client"

import { useState } from "react"
import { X, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  service: {
    name: string
    price: number
    description: string
    features: string[]
    priceId: string
  }
}

export function PaymentDialog({ isOpen, onClose, service }: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handlePayment = async () => {
    if (!email) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: service.priceId,
          email: email,
          serviceName: service.name,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Payment error:", error)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md transform animate-in fade-in-0 zoom-in-95 duration-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-slate-900">{service.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold text-slate-900 mb-2">${service.price}</div>
          <p className="text-slate-600 mb-4">{service.description}</p>

          <div className="space-y-2">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-green-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <Button
          onClick={handlePayment}
          disabled={!email || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isLoading ? "Processing..." : `Pay $${service.price}`}
        </Button>

        <p className="text-xs text-slate-500 text-center mt-4">Secure payment powered by Stripe</p>
      </div>
    </div>
  )
}
