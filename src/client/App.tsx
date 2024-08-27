import React, { useState } from 'react';

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '2rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  color: '#373737',
};

const uploadButtonStyle: React.CSSProperties = {
  display: 'block',
  margin: '1rem auto',
  padding: '0.5rem',
  fontSize: '1rem',
};

const temperatureMapStyle: React.CSSProperties = {
  width: '80vw',
  maxWidth: '1200px',
  height: 'auto',
  borderRadius: '8px',
};

const processingMessageStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>('/empty-map.jpg');
  const [inProgress, setInProgress] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (imageSrc != '/empty-map.jpg') {
      setImageSrc('/empty-map.jpg');
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setInProgress(true);
    try {
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const imageBlob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageObjectUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      setImageSrc(null);
    } finally {
      setInProgress(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Sea Surface Temperature Map</h1>
      {inProgress && <p style={processingMessageStyle}>Processing...</p>}
      <input type='file' onChange={handleFileUpload} style={uploadButtonStyle} />
      <div>{imageSrc && <img style={temperatureMapStyle} src={imageSrc} alt='Heatmap' />}</div>
    </div>
  );
};

export default App;
