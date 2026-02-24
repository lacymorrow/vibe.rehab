import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Confirmed - Your Code Fix Is On the Way | Vibe Rehab",
  description:
    "Your payment has been processed successfully. Our team is reviewing your project and will get started on fixing your code right away. Expect updates within 24 hours.",
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
