import React, { useState } from 'react';
import './CreateTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useCreateTripMutation } from '../../features/api';
import { useAppSelector } from '../../features/store';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const userId = useAppSelector((state) => state.auth.userId);
  const [createTrip] = useCreateTripMutation();

  /**
   * react-datepicker can provide either a single Date or a tuple of [Date, Date], or null.
   * We'll handle the case for a date range (start & end).
   */
  const handleDateChange = (
    dates: [Date | null, Date | null] | null,
    event?: React.SyntheticEvent<any> | undefined
  ) => {
    if (dates) {
      const [start, end] = dates;
      setStartDate(start || undefined);
      setEndDate(end || undefined);
    }
  };

  const handleSaveTrip = async () => {
    // Clear any existing messages
    setNotificationMessage('');
    setErrorMessage('');
  
    if (!userId) {
      setErrorMessage('User ID not found. Please log in again.');
      return;
    }
  
    // Simple validation
    if (!tripName || !description || !startDate || !endDate) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    // Build the data for the trip
    const postData = {
      name: tripName,
      destination: tripName, // using the same value for destination
      description: description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  
    try {
      // Attempt to create the trip (pass both data and userId)
      const createTripResponse = await createTrip({
        data: postData,
        userId,
      }).unwrap();
  
      if (createTripResponse?.tripId) {
        setNotificationMessage('Trip created successfully!');
        // Clear the form
        setTripName('');
        setDescription('');
        setStartDate(undefined);
        setEndDate(undefined);
      } else {
        // If .tripId is missing, treat it as an error
        throw new Error('Failed to create trip');
      }
    } catch (error: any) {
      const serverMessage = error?.data?.message || 'Failed to create trip. Please try again.';
      
      // Check if the error message indicates an overlapping trip
      if (serverMessage.includes('overlapping trip')) {
        alert('You have another trip during this time!');
      } else {
        setErrorMessage(serverMessage);
      }
    }
  };

  return (
    <div className="createTrip">
      <h1 className="title">Create Trip</h1>

      <div className="section-container">
        <h3 className="subtitle">Destination</h3>
        <input
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder="Enter destination name"
        />

        <h3 className="subtitle">Description</h3>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
        />
      </div>

      <div className="section-container">
        <div>
          <h3 className="subtitle">Start Date:</h3>
          <input
            type="text"
            id="start-date"
            value={
              startDate
                ? new Date(
                    startDate.getTime() - startDate.getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .split('T')[0]
                : ''
            }
            readOnly
            placeholder="Select a start date"
          />
        </div>
        <div>
          <h3 className="subtitle">End Date:</h3>
          <input
            type="text"
            id="end-date"
            value={
              endDate
                ? new Date(
                    endDate.getTime() - endDate.getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .split('T')[0]
                : ''
            }
            readOnly
            placeholder="Select an end date"
          />
        </div>
      </div>

      <div className="calendar">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <button onClick={handleSaveTrip} className="save-trip-btn">
        Save Trip
      </button>

      {notificationMessage && (
        <div className="success-message">{notificationMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default CreateTrip;
