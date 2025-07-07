"use client";

import type React from "react";

import { useState } from "react";
import { X, Mail, User, MessageSquare, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submittedValue: string;
  detectedType: "github" | "url" | "message" | "email";
}

export function ContactDialog({
  isOpen,
  onClose,
  submittedValue,
  detectedType,
}: ContactDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectDetails: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, type: "submit" | "roast") => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          projectDetails: formData.projectDetails,
          submittedValue,
          detectedType,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setIsSubmitted(true);
      setIsSubmitting(false);

      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({ name: "", email: "", projectDetails: "" });
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setIsSubmitting(false);
      // You could add error handling here
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTypeIcon = () => {
    switch (detectedType) {
      case "github":
        return <Github className="w-5 h-5 text-slate-600" />;
      case "url":
        return <Globe className="w-5 h-5 text-slate-600" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-slate-600" />;
      default:
        return <Mail className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (detectedType) {
      case "github":
        return "GitHub Repository";
      case "url":
        return "Website URL";
      case "message":
        return "Project Description";
      default:
        return "Submission";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg transform animate-in fade-in-0 zoom-in-95 duration-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-slate-900">
            Tell us about your project
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form className="space-y-6">
            {/* Detected submission display */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon()}
                <span className="text-sm font-medium text-slate-700">
                  {getTypeLabel()}
                </span>
              </div>
              <div className="text-slate-600 text-sm break-all bg-white rounded px-3 py-2 border">
                {submittedValue}
              </div>
            </div>

            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Project details */}
            <div>
              <label
                htmlFor="projectDetails"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Project Details
              </label>
              <textarea
                id="projectDetails"
                value={formData.projectDetails}
                onChange={(e) =>
                  handleInputChange("projectDetails", e.target.value)
                }
                placeholder="Tell us about your project, what's broken, what you need help with, timeline, etc."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={(e) => handleSubmit(e, "submit")}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Get Help with Project"
                )}
              </Button>

              <Button
                onClick={(e) => handleSubmit(e, "roast")}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Just Roast My Work"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 mb-2">
              Thanks! We'll be in touch
            </h4>
            <p className="text-slate-600">
              Expect to hear from us within 24 hours with next steps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
