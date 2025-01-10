import React, { useState } from 'react';
import './CreateTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useAddUserToTripMutation, useCreateTripMutation } from '../../features/api';
import { useAppSelector } from '../../features/store';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const userId = useAppSelector(state => state.auth.userId);
  const [createTrip] = useCreateTripMutation();
  const [addUserToTrip] = useAddUserToTripMutation();
  const handleDateChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSaveTrip = async () => {
    const postdata = {
      name: tripName,
      destination: tripName,
      description: description,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    };

    let createTripResponse = await createTrip(postdata);
    await addUserToTrip({ tripId: createTripResponse.data?.tripId!, userId: userId! });
    alert('Trip created successfully');
  };

  return (
    <div className='createTrip'>
      <h1 className='title'>Create Trip</h1>

      <div className='section-container'>
        <h3 className="subtitle">Destination</h3>
        <input
          type='text'
          value={tripName}
          onChange={e => setTripName(e.target.value)}
          placeholder='Enter destination name'
        />
        <h3 className="subtitle">Description</h3>
        <input
          type='text'
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Enter a description'
        />
      </div>

      <div className='section-container'>
        <div>
          <h3 className="subtitle">Start Date:</h3>
          <input
            type='text'
            id='start-date'
            value={
              startDate
                ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                : ''
            }
            readOnly
            placeholder='Select a start date'
          />
        </div>
        <div>
          <h3 className="subtitle">End Date:</h3>
          <input
            type='text'
            id='end-date'
            value={
              endDate
                ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                : ''
            }
            readOnly
            placeholder='Select an end date'
          />
        </div>
      </div>

      <div className='section-container'>
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
          dropdownMode='select'
        />
      </div>

      <button onClick={handleSaveTrip} className='save-trip-btn'>
        Save Trip
      </button>
  
    </div>
    
  );
};

export default CreateTrip;
