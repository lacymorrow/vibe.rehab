import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success - Payment Confirmed",
  description:
    "Your payment has been processed successfully. We'll get started on fixing your code right away!",
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
