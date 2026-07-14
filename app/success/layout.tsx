import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Confirmed - Your Fix Is On the Way",
  description:
    "Payment confirmed. Our team is reviewing your project and will start fixing your code within 24 hours.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
