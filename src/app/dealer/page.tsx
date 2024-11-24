"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface CustomerDTO {
  customerId: number;
  customerName: string;
  customerContactNumber: string;
}

interface DealerWithCustomersDTO {
  dealerId: number;
  dealerName: string;
  dealerContactNumber: string;
  customers: CustomerDTO[];
}

const DealerWithClients = () => {
  const [dealers, setDealers] = useState<DealerWithCustomersDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch dealers with associated customers
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/dealer/with-customers");
        setDealers(response.data);
      } catch (error) {
        console.error("Error fetching dealers:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch dealers. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
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
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/assets/images/carpage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      ></div>

      {/* Content */}
      <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
        <h1
          style={{ textAlign: "center", marginBottom: "20px" }}
          className="text-4xl font-bold text-white"
        >
          Dealers and Their Clients
        </h1>

        {/* Dealers Section */}
        <section>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {dealers.map((dealer) => (
              <div
                key={dealer.dealerId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                <h3>{dealer.dealerName}</h3>
                <p>
                  <strong>Contact Number:</strong> {dealer.dealerContactNumber}
                </p>
                <h4 style={{ marginTop: "10px", fontWeight: "bold" }}>Associated Clients:</h4>
                <ul>
                  {dealer.customers && dealer.customers.length > 0 ? (
                    dealer.customers.map((customer) => (
                      <li key={customer.customerId}>
                        {customer.customerName} - {customer.customerContactNumber}
                      </li>
                    ))
                  ) : (
                    <li>No associated clients</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DealerWithClients;
