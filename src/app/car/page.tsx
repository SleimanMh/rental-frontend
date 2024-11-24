"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  efficiency: number;
  pricePerDay: number;
  rented: boolean;
}

const CarPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/car"); // Backend API
        setCars(response.data);
      } catch (error) {
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

  const handleRent = async (carId: number) => {
    try {
      // Ask if the client is new or existing
      const { value: clientType } = await Swal.fire({
        title: "Are you a new or existing client?",
        input: "radio",
        inputOptions: {
          new: "New Client",
          existing: "Existing Client",
        },
        inputValidator: (value) => {
          if (!value) {
            return "You need to choose an option!";
          }
        },
        showCancelButton: true,
        confirmButtonText: "Next",
      });
  
      if (!clientType) {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "You must select an option to proceed!",
        });
        return;
      }
  
      let clientName;
  
      if (clientType === "new") {
        // Collect new client details
        const { value: newClientName } = await Swal.fire({
          title: "Enter Your Name",
          input: "text",
          inputPlaceholder: "Your Name",
          showCancelButton: true,
          confirmButtonText: "Next",
        });
  
        if (!newClientName) {
          Swal.fire({
            icon: "warning",
            title: "Cancelled",
            text: "Client name is required!",
          });
          return;
        }
  
        const { value: clientEmail } = await Swal.fire({
          title: "Enter Your Email",
          input: "email",
          inputPlaceholder: "Your Email",
          showCancelButton: true,
          confirmButtonText: "Next",
        });
  
        const { value: clientContact } = await Swal.fire({
          title: "Enter Your Contact Number",
          input: "text",
          inputPlaceholder: "Your Contact Number",
          showCancelButton: true,
          confirmButtonText: "Next",
        });
  
        if (!clientEmail || !clientContact) {
          Swal.fire({
            icon: "warning",
            title: "Cancelled",
            text: "All details are required for new clients!",
          });
          return;
        }
  
        // Call API to create a new client
        await axios.post("http://localhost:8080/customer", {
          name: newClientName,
          email: clientEmail,
          customerContactNumber: clientContact,
        });
  
        clientName = newClientName;
      } else if (clientType === "existing") {
        // Collect client name for existing client
        const { value: existingClientName } = await Swal.fire({
          title: "Enter Your Name",
          input: "text",
          inputPlaceholder: "Your Name",
          showCancelButton: true,
          confirmButtonText: "Next",
        });
  
        if (!existingClientName) {
          Swal.fire({
            icon: "warning",
            title: "Cancelled",
            text: "Client name is required!",
          });
          return;
        }
  
        // Verify client exists by name
        const clientResponse = await axios.get(
          `http://localhost:8080/customer/${existingClientName}`
        );
  
        if (!clientResponse.data) {
          Swal.fire({
            icon: "error",
            title: "Not Found",
            text: "No client found with that name. Please register as a new client.",
          });
          return;
        }
  
        clientName = existingClientName;
      }
  
      // Proceed with rental
      const { value: numberOfDays } = await Swal.fire({
        title: "Enter Number of Days",
        input: "number",
        inputPlaceholder: "Number of Days",
        inputValue: 1,
        showCancelButton: true,
        confirmButtonText: "Next",
      });
  
      if (!numberOfDays || numberOfDays <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Cancelled",
          text: "Please enter a valid number of days.",
        });
        return;
      }
  
      const selectedCar = cars.find((car) => car.id === carId);
      if (!selectedCar) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Car not found.",
        });
        return;
      }
  
      const totalPrice = numberOfDays * selectedCar.pricePerDay;
  
      const confirmation = await Swal.fire({
        title: "Confirm Rental",
        html: `
          <p><strong>Client Name:</strong> ${clientName}</p>
          <p><strong>Car:</strong> ${selectedCar.brand} ${selectedCar.model}</p>
          <p><strong>Number of Days:</strong> ${numberOfDays}</p>
          <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      });
  
      if (confirmation.isConfirmed) {
        const response = await axios.post("http://localhost:8080/rental", null, {
          params: {
            clientName,
            carId,
            numberOfDays,
          },
        });
  
        const invoice = response.data;
  
        Swal.fire({
          icon: "success",
          title: "Rented",
          html: `
            <p><strong>Invoice ID:</strong> ${invoice.invoiceId}</p>
            <p><strong>Issue Date:</strong> ${invoice.issueDate}</p>
            <p><strong>Amount Due:</strong> $${invoice.amountDue.toFixed(2)}</p>
          `,
        });
  
        setCars((prevCars) =>
          prevCars.map((car) =>
            car.id === carId ? { ...car, rented: true } : car
          )
        );
      } else {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Your rental process has been cancelled.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to rent the car. Please try again.",
      });
    }
  };  
  
  
  if (loading) {
    return <p>Loading cars...</p>;
  }

  return (
    <div
      style={{
        position: "relative",
        height: "100vh", // Full-screen height
        width: "100%", // Full width
        overflow: "hidden", // Ensure no overflow
      }}
    >
      {/* Gray Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(128, 128, 128, 0.2)", // Light gray overlay
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}
        className="text-4xl font-bold">
          Available Cars
        </h1>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255,255,255,0.8)"
              }}
            >
              <h2>
                {car.brand} {car.model}
              </h2>
              <p>
                <strong>Year:</strong> {car.year}
              </p>
              <p>
                <strong>Efficiency:</strong> {car.efficiency} km/l
              </p>
              <p>
                <strong>Price Per Day:</strong> {car.pricePerDay}
              </p>
              <p>
                <strong>Status:</strong> {car.rented ? "Rented" : "Available"}
              </p>
              {!car.rented && (
                <button
                  onClick={() => handleRent(car.id)}
                  style={{
                    backgroundColor: "rgba(180,180,180,0.8)",
                    color: "black",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Rent Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarPage;
