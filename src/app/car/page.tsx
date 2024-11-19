"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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

const CarPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/car'); // Backend API
        setCars(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch cars. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleRent = async (carId: number) => {
    try {
      const { value: clientName } = await Swal.fire({
        title: 'Enter Your Name',
        input: 'text',
        inputPlaceholder: 'Your Name',
        showCancelButton: true,
        confirmButtonText: 'Next',
      });
  
      if (!clientName) {
        Swal.fire({
          icon: 'warning',
          title: 'Cancelled',
          text: 'Client name is required!',
        });
        return;
      }
  
      const { value: numberOfDays } = await Swal.fire({
        title: 'Enter Number of Days',
        input: 'number',
        inputPlaceholder: 'Number of Days',
        inputValue: 1,
        showCancelButton: true,
        confirmButtonText: 'Rent Now',
      });
  
      if (!numberOfDays || numberOfDays <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Cancelled',
          text: 'Please enter a valid number of days.',
        });
        return;
      }
  
      const response = await axios.post('http://localhost:8080/rental', null, {
        params: {
          clientName,
          carId,
          numberOfDays,
        },
      });
  
      const invoice = response.data; // Extract the invoice from the response
  
      Swal.fire({
        icon: 'success',
        title: 'Rented',
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
    } catch (error) {
      console.error('Error renting car:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to rent the car. Please try again.',
      });
    }
  };
   
  if (loading) {
    return <p>Loading cars...</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Available Cars</h1>
      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {cars.map((car) => (
          <div
            key={car.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
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
              <strong>Daily Rent:</strong> ${car.dailyRent}
            </p>
            <p>
              <strong>Price Per Day:</strong> ${car.pricePerDay}
            </p>
            <p>
              <strong>Status:</strong> {car.rented ? 'Rented' : 'Available'}
            </p>
            {!car.rented && (
              <button
                onClick={() => handleRent(car.id)}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Rent Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarPage;
