import React, { useState } from 'react';
import axios from "axios";

const SiteUploader = () => {
  const [site, setSite] = useState(null);

  const handleSiteInput = (event) => {
    const website = event.target.value;
    console.log(website)
      setSite(website);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (site) {
          try {
            const response = await axios.post(
            `${import.meta.env.VITE_API_URL}store_website`,
            { site },
            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data); // Handle success response
        alert('Site uploaded successfully');
      } catch (error) {
        console.error('Error uploading site:', error);
        alert('Site upload failed');
      }
    } else {
      alert('No site selected');
    }
  };

  const styles = {
  input: {
    border: 'solid 1px #bababa',
    borderRadius: '5px'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#0085e1',
    color: '#eeeeee',
    fontWeight:'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  secondaryButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#818181',
    color: '#eeeeee',
    fontWeight:'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
};

  return (
    <div className='m-5 p-5 ring ring-gray-100 rounded'>
      Add a website URL:
      <form onSubmit={handleSubmit} className='flex-col'>
        <div className='flex-row'>
          {site && <button style={styles.button} type="submit">Upload</button>}
        </div>
        <input type="text" style={styles.input} onChange={handleSiteInput} />
      </form>
    </div>
  );
};

export default SiteUploader;
