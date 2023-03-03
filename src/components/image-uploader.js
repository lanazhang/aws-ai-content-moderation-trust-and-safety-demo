import React, { useState } from 'react';
import { Storage } from 'aws-amplify';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = event => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const fileName = file.name;
      const stored = await Storage.put(fileName, file, {
        contentType: file.type
      });

      setSuccess(true);
      setUploading(false);
    } catch (error) {
      setError(error.message);
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload Image</h3>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Upload successful!</p>}
    </div>
  );
};

export default UploadImage;