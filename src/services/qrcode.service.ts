import QRCode from 'qrcode';
import { generatePresignedUrl } from './aws-s3.service';

export interface QRCodeData {
  patientId: string;
  patientName: string;
  records: Array<{
    date: string;
    type: string;
    title: string;
    description?: string;
    fileKey?: string;
  }>;
  generatedDate: string;
  expiresAt?: string;
}

/**
 * Generate QR code with temporary access link
 * Doctor scans to view specific records via a temporary URL
 */
export const generateQRCodeWithAccessLink = async (
  fileKeys: string[],
  patientId: string,
  expiresIn: number = 3600 // Default: 1 hour
): Promise<string> => {
  try {
    // Generate presigned URLs for all files
    const presignedUrls = await Promise.all(
      fileKeys.map(key => generatePresignedUrl(key, expiresIn))
    );

    // Create access data
    const accessData = {
      type: 'MEDICAL_RECORD_ACCESS',
      patientId,
      urls: presignedUrls,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      generatedAt: new Date().toISOString(),
    };

    // In a real application, you would store this data on your server
    // and generate a short access URL. For now, we'll create a URL with encoded data
    const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
    const accessToken = btoa(JSON.stringify(accessData));
    const accessUrl = `${appUrl}/patient-access?token=${accessToken}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(accessUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code with access link:', error);
    throw new Error('Failed to generate QR code. Please try again.');
  }
};

/**
 * Generate QR code with patient data encoded
 * Doctor scans to import data directly (no server needed)
 */
export const generateQRCodeWithEncodedData = async (
  qrData: QRCodeData
): Promise<string> => {
  try {
    // Create encoded patient data
    const encodedData = {
      type: 'MEDICAL_RECORD_DATA',
      version: '1.0',
      ...qrData,
    };

    // Convert to JSON string
    const jsonData = JSON.stringify(encodedData);

    // Generate QR code with embedded data
    const qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
      errorCorrectionLevel: 'M', // Medium level for larger data
      type: 'image/png',
      quality: 1,
      margin: 1,
      width: 500,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code with encoded data:', error);
    throw new Error('Failed to generate QR code. Please try again.');
  }
};

/**
 * Generate multiple QR codes for different record types
 */
export const generateMultipleQRCodes = async (
  recordsByType: Map<string, string[]>, // Map of record type to file keys
  patientId: string,
  mode: 'link' | 'data' = 'link'
): Promise<Map<string, string>> => {
  const qrCodes = new Map<string, string>();

  for (const [recordType, fileKeys] of recordsByType.entries()) {
    if (mode === 'link') {
      const qrCode = await generateQRCodeWithAccessLink(fileKeys, patientId);
      qrCodes.set(recordType, qrCode);
    } else {
      // For data mode, you would need to fetch the actual record data
      // This is a simplified example
      const qrData: QRCodeData = {
        patientId,
        patientName: 'Patient', // Would be fetched from your data store
        records: fileKeys.map(key => ({
          date: new Date().toISOString(),
          type: recordType,
          title: `${recordType} Document`,
          fileKey: key,
        })),
        generatedDate: new Date().toISOString(),
      };
      const qrCode = await generateQRCodeWithEncodedData(qrData);
      qrCodes.set(recordType, qrCode);
    }
  }

  return qrCodes;
};

/**
 * Generate a comprehensive patient summary QR code
 */
export const generatePatientSummaryQR = async (
  patientData: {
    id: string;
    name: string;
    dateOfBirth?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
    recentDiagnoses?: string[];
    currentMedications?: string[];
  }
): Promise<string> => {
  try {
    const summaryData = {
      type: 'PATIENT_SUMMARY',
      version: '1.0',
      patient: patientData,
      generatedAt: new Date().toISOString(),
    };

    const jsonData = JSON.stringify(summaryData);

    const qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 500,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating patient summary QR code:', error);
    throw new Error('Failed to generate patient summary QR code.');
  }
};

/**
 * Decode QR code data (for scanning)
 */
export const decodeQRCodeData = (qrData: string): any => {
  try {
    // Try to parse as JSON first
    const parsedData = JSON.parse(qrData);
    return parsedData;
  } catch (error) {
    // If not JSON, try to decode base64
    try {
      const decodedData = atob(qrData);
      return JSON.parse(decodedData);
    } catch (e) {
      // If all else fails, return the raw data
      return { raw: qrData };
    }
  }
};

/**
 * Validate QR code data
 */
export const validateQRCodeData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check if it has required fields based on type
  if (data.type === 'MEDICAL_RECORD_ACCESS') {
    return !!(data.patientId && data.urls && Array.isArray(data.urls));
  }

  if (data.type === 'MEDICAL_RECORD_DATA') {
    return !!(data.patientId && data.records && Array.isArray(data.records));
  }

  if (data.type === 'PATIENT_SUMMARY') {
    return !!(data.patient && data.patient.id);
  }

  return false;
};

/**
 * Check if QR code has expired
 */
export const isQRCodeExpired = (data: any): boolean => {
  if (!data.expiresAt) {
    return false; // No expiration set
  }

  const expirationDate = new Date(data.expiresAt);
  const now = new Date();

  return now > expirationDate;
};

/**
 * Generate download filename for QR code
 */
export const getQRCodeFilename = (type: string, patientId: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `medical-qr-${type}-${patientId}-${timestamp}.png`;
};

/**
 * Convert data URL to blob for download
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Download QR code as image
 */
export const downloadQRCode = (qrCodeDataUrl: string, filename: string): void => {
  const blob = dataURLtoBlob(qrCodeDataUrl);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
