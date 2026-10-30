import { Metadata } from "next";

export const metadata: Metadata = {
  // Anyone can open /success without an order, so the title and description
  // describe the page rather than confirm a payment.
  title: "Order status",
  description: "Check an order and tell us what to fix.",
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
