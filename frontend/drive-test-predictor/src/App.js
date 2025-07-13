import React, {useState} from 'react';
import './App.css';


// const faetureNames = [
//   'Longitude', 'Latitude', 'Speed', 'CellID',
//   'CQI', 'RSSI', 'DL_bitrate', 'UL_bitrate',
//   'NRxRSRP', 'NRxRSRQ', 'ServingCell_Lon',
//   'ServingCell_Lat', 'ServingCell_Distance','Mode_of_Transport',
// ];


// function App() {
//   const [features, setFeatures] = useState({});
//   const [prediction, SetPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) =>{
//     setFeatures({
//       ...features,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('http://localhost:5000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(features)
//       });
//       if (!response.ok) throw new Error('Network response was not ok');
//       const data = await response.json();
//       SetPrediction(data.prediction);
//     }
//     catch (err) {
//       setError('Error fetching prediction: ' + err.message);
//     }
//     finally {
//       setLoading(false);  
//     }
//     };

//     return (
//     <div className = 'App'>
//       <h1>Drive Test Prediction App</h1>
//     </div>
//   );

// }

// export default App;

const featureNames = [
  'Longitude', 'Latitude', 'Speed', 'CellID',
  'CQI', 'RSSI', 'DL_bitrate', 'UL_bitrate',
  'NRxRSRP', 'NRxRSRQ', 'ServingCell_Lon',
  'ServingCell_Lat', 'ServingCell_Distance'
];

function App() {
  const [features, setFeatures] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFeatures({
      ...features,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Drive Test Prediction App</h1>

      <form onSubmit={handleSubmit}>
        {featureNames.map((name) => (
          <div key={name}>
            <label>{name}: </label>
            <input
              type="number"
              name={name}
              value={features[name] || ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prediction && (
        <div>
          <h2>Prediction Result:</h2>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
