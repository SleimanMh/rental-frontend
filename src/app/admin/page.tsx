"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  efficiency: number;
  dailyRent: number;
  pricePerDay: number;
  rented: boolean;
}

interface Dealer {
  dealerId: number;
  name: string;
  dealerContactNumber: string;
}

const AdminPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/car");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch cars. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Fetch all dealers
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/dealer");
        setDealers(response.data);
      } catch (error) {
        console.error("Error fetching dealers:", error);
      }
    };

    fetchDealers();
  }, []);

  // Change car status
  const changeCarStatus = async (carId: number) => {
    try {
      await axios.put(`http://localhost:8080/admin/car/available/${carId}`);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Car status updated to Available.",
      });
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId ? { ...car, rented: false } : car
        )
      );
    } catch (error) {
      console.error("Error updating car status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update car status. Please try again.",
      });
    }
  };

  // Add a new dealer
  const addDealer = async () => {
    const { value: name } = await Swal.fire({
      title: "Enter Dealer Name",
      input: "text",
      inputPlaceholder: "Dealer Name",
      showCancelButton: true,
    });

    if (!name) return;

    const { value: contactNumber } = await Swal.fire({
      title: "Enter Dealer Contact Number",
      input: "text",
      inputPlaceholder: "Contact Number",
      showCancelButton: true,
    });

    if (!contactNumber) return;

    try {
      const newDealer = { name, dealerContactNumber: contactNumber };
      const response = await axios.post("http://localhost:8080/dealer", newDealer);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Dealer added successfully.",
      });

      setDealers((prevDealers) => [...prevDealers, response.data]);
    } catch (error) {
      console.error("Error adding dealer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add dealer. Please try again.",
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Panel</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>Manage Cars</h2>
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {cars.map((car) => (
            <div
              key={car.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{car.brand} {car.model}</h3>
              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>Status:</strong> {car.rented ? "Rented" : "Available"}</p>
              {car.rented && (
                <button
                  onClick={() => changeCarStatus(car.id)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Set Available
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Manage Dealers</h2>
        <button
          onClick={addDealer}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Add Dealer
        </button>
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {dealers.map((dealer) => (
            <div
              key={dealer.dealerId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{dealer.name}</h3>
              <p><strong>Contact Number:</strong> {dealer.dealerContactNumber}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
