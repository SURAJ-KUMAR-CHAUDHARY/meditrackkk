import React, { useState } from "react"; 
import { uploadRawFileToS3 } from "../services/aws-s3.service"; 

const TestUpload: React.FC = () => { 
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [status, setStatus] = useState<string>(""); 

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => { 
    if (event.target.files && event.target.files.length > 0) { 
      setSelectedFile(event.target.files[0]); 
    } 
  }; 

  const handleUpload = async () => { 
    if (!selectedFile) { 
      setStatus("⚠️ No file selected"); 
      return; 
    } 

    try { 
      setStatus("⏳ Uploading..."); 
      
      const key = `uploads/${Date.now()}-${selectedFile.name}`; 

      await uploadRawFileToS3(selectedFile, key); 

      setStatus("✅ File uploaded successfully!"); 
    } catch (error: any) { 
      console.error("Upload error:", error); 
      setStatus(`❌ Upload failed: ${error.message}`); 
    } 
  }; 

  return ( 
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}> 
      <h2>Upload Patient File (Debug Mode)</h2> 
      <input type="file" onChange={handleFileSelect} style={{ display: 'block', margin: '20px 0' }} /> 
      <button 
        onClick={handleUpload}
        style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }}
      >
        Upload
      </button> 
      <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{status}</p> 
    </div> 
  ); 
}; 

export default TestUpload;