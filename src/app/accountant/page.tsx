"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface InvoiceDTO {
  invoiceId: number;
  amountDue: number;
  issueDate: string; // Assuming backend sends a string date
  customerName: string;
  dealerName: string;
  carDetails: string; // E.g., "Toyota Corolla (2022)"
  rentalDate: string;
  returnDate: string;
  numberOfDays: number;
  rentalStatus: string;
}

const AccountantPage = () => {
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/invoice");
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch invoices. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: "20px",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/assets/images/invoice-bg.jpg')", // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      ></div>

      <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
        <h1
          style={{ textAlign: "center", marginBottom: "20px" }}
          className="text-4xl font-bold text-white"
        >
          Accountant Panel
        </h1>

        <section style={{ marginBottom: "40px" }}>
          <h2 className="text-3xl font-bold text-black">Invoices</h2>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {invoices.map((invoice) => (
              <div
                key={invoice.invoiceId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                <h3>Invoice ID: {invoice.invoiceId}</h3>
                <p>
                  <strong>Amount Due:</strong> ${invoice.amountDue.toFixed(2)}
                </p>
                <p>
                  <strong>Issue Date:</strong> {invoice.issueDate}
                </p>
                <h4>Rental Details:</h4>
                <p>
                  <strong>Customer:</strong> {invoice.customerName}
                </p>
                <p>
                  <strong>Dealer:</strong> {invoice.dealerName}
                </p>
                <p>
                  <strong>Car:</strong> {invoice.carDetails}
                </p>
                <p>
                  <strong>Rental Date:</strong> {invoice.rentalDate}
                </p>
                <p>
                  <strong>Return Date:</strong> {invoice.returnDate}
                </p>
                <p>
                  <strong>Number of Days:</strong> {invoice.numberOfDays}
                </p>
                <p>
                  <strong>Status:</strong> {invoice.rentalStatus}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountantPage;
