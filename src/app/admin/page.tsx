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
  pricePerDay: number;
  rented: boolean;
}

interface Dealer {
  dealerId: number;
  name: string;
  dealerContactNumber: string;
  date_of_birth: string; // Assuming backend sends date as a string
  email: string;
  address: string;
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

  // Add a new car
  const addCar = async () => {
    const { value: brand } = await Swal.fire({
      title: "Enter Car Brand",
      input: "text",
      inputPlaceholder: "Brand",
      showCancelButton: true,
    });

    if (!brand) return;

    const { value: model } = await Swal.fire({
      title: "Enter Car Model",
      input: "text",
      inputPlaceholder: "Model",
      showCancelButton: true,
    });

    if (!model) return;

    const { value: year } = await Swal.fire({
      title: "Enter Car Year",
      input: "number",
      inputPlaceholder: "Year",
      showCancelButton: true,
    });

    if (!year || isNaN(parseInt(year))) return;

    const { value: efficiency } = await Swal.fire({
      title: "Enter Car Efficiency (km/L)",
      input: "number",
      inputPlaceholder: "Efficiency",
      showCancelButton: true,
    });

    if (!efficiency || isNaN(parseFloat(efficiency))) return;

    const { value: pricePerDay } = await Swal.fire({
      title: "Enter Price Per Day",
      input: "number",
      inputPlaceholder: "Price Per Day",
      showCancelButton: true,
    });

    if (!pricePerDay || isNaN(parseFloat(pricePerDay))) return;

    const newCar = {
      model,
      brand,
      year: parseInt(year),
      efficiency: parseFloat(efficiency),
      pricePerDay: parseFloat(pricePerDay),
      rented: false,
    };

    try {
      const response = await axios.post("http://localhost:8080/car", newCar);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Car added successfully.",
      });
      setCars((prevCars) => [...prevCars, response.data]);
    } catch (error) {
      console.error("Error adding car:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add car. Please try again.",
      });
    }
  };

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
    // Ask for dealer name
    const { value: name } = await Swal.fire({
      title: "Enter Dealer Name",
      input: "text",
      inputPlaceholder: "Dealer Name",
      showCancelButton: true,
    });

    if (!name) return;

    // Ask for dealer contact number
    const { value: contactNumber } = await Swal.fire({
      title: "Enter Dealer Contact Number",
      input: "text",
      inputPlaceholder: "Contact Number",
      showCancelButton: true,
    });

    if (!contactNumber) return;

    // Ask for dealer date of birth
    const { value: date_of_birth } = await Swal.fire({
      title: "Enter Dealer Date of Birth",
      input: "text",
      inputPlaceholder: "YYYY-MM-DD",
      showCancelButton: true,
    });

    if (!date_of_birth) return;

    // Ask for dealer email
    const { value: email } = await Swal.fire({
      title: "Enter Dealer Email",
      input: "email",
      inputPlaceholder: "Email Address",
      showCancelButton: true,
    });

    if (!email) return;

    // Ask for dealer address
    const { value: address } = await Swal.fire({
      title: "Enter Dealer Address",
      input: "text",
      inputPlaceholder: "Address",
      showCancelButton: true,
    });

    if (!address) return;

    // Prepare the new dealer object
    const newDealer = { name, dealerContactNumber: contactNumber, date_of_birth, email, address };

    try {
      // Send POST request to add dealer
      const response = await axios.post("http://localhost:8080/dealer", newDealer);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Dealer added successfully.",
      });

      // Update the dealers list with the newly added dealer
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

  const deleteCar = async (carId: number) => {
    try {
      await axios.delete(`http://localhost:8080/car/${carId}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Car has been deleted successfully.",
      });
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    } catch (error) {
      console.error("Error deleting car:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the car. Please try again.",
      });
    }
  };

  const deleteDealer = async (dealerId: number) => {
    try {
      await axios.delete(`http://localhost:8080/dealer/${dealerId}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Dealer has been deleted successfully.",
      });
      setDealers((prevDealers) =>
        prevDealers.filter((dealer) => dealer.dealerId !== dealerId)
      );
    } catch (error) {
      console.error("Error deleting dealer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the dealer. Please try again.",
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: "20px",
        height: "100vh",
        overflow: "hidden", // Prevent scrolling on the body
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
          backgroundImage: "url('/assets/images/carpage.jpg')", // Replace with your image URL
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
          Admin Panel
        </h1>

        <section style={{ marginBottom: "40px" }}>
          <h2 className="text-3xl font-bold text-black">Manage Cars</h2>
          <button
            onClick={addCar}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Add Car
          </button>
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
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                <h3>
                  {car.brand} {car.model}
                </h3>
                <p>
                  <strong>Year:</strong> {car.year}
                </p>
                <p>
                  <strong>Status:</strong> {car.rented ? "Rented" : "Available"}
                </p>
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
                <button
                  onClick={() => deleteCar(car.id)}
                  style={{
                    backgroundColor: "#FF0000",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Delete Car
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-black">Manage Dealers</h2>
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
                <h3>{dealer.name}</h3>
                <p>
                  <strong>Contact Number:</strong> {dealer.dealerContactNumber}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {dealer.date_of_birth}
                </p>
                <p>
                  <strong>Email:</strong> {dealer.email}
                </p>
                <p>
                  <strong>Address:</strong> {dealer.address}
                </p>
                <div>
                  <button
                    onClick={() => deleteDealer(dealer.dealerId)}
                    style={{
                      backgroundColor: "#FF0000",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Delete Dealer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
