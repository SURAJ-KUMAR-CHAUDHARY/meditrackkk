import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Use Gemini 2.5 Flash model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export interface MedicalRecord {
  id?: string;
  date: string;
  type: string;
  title: string;
  description?: string;
  provider?: string;
  medications?: string[];
  diagnosis?: string[];
  notes?: string;
}

/**
 * Generate AI summary of medical records using Gemini 2.5 Flash
 */
export const generateMedicalSummary = async (
  records: MedicalRecord[]
): Promise<string> => {
  try {
    if (!records || records.length === 0) {
      return 'No medical records available for analysis.';
    }

    // Prepare the medical data for analysis
    const medicalData = records.map(record => ({
      date: record.date,
      type: record.type,
      title: record.title,
      description: record.description || '',
      provider: record.provider || '',
      medications: record.medications || [],
      diagnosis: record.diagnosis || [],
      notes: record.notes || '',
    }));

    const prompt = `You are an AI medical assistant analyzing patient health records. Generate a comprehensive, easy-to-understand health summary based on the following medical records:

${JSON.stringify(medicalData, null, 2)}

Please provide:
1. **Overall Health Overview** - A brief summary of the patient's general health status
2. **Key Medical Events** - Important diagnoses, treatments, or procedures
3. **Current Medications** - List of current medications (if any)
4. **Chronic Conditions** - Any ongoing health issues requiring management
5. **Recommendations** - General health recommendations or follow-up suggestions

Format the response in a clear, patient-friendly manner using markdown-style formatting with ** for headers and - for bullet points. Keep it concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error('Error generating medical summary with Gemini:', error);
    throw new Error('Failed to generate AI summary. Please try again.');
  }
};

/**
 * Analyze a specific medical document and extract key information
 */
export const analyzeMedicalDocument = async (
  documentText: string,
  documentType: string
): Promise<string> => {
  try {
    const prompt = `Analyze this ${documentType} medical document and extract key information:

${documentText}

Please provide:
- Document Type: ${documentType}
- Key Findings: List the main findings or results
- Medical Terms Explained: Explain any complex medical terminology in simple terms
- Action Items: Any recommendations or follow-up actions mentioned

Format the response clearly with headers and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return analysis;
  } catch (error) {
    console.error('Error analyzing document with Gemini:', error);
    throw new Error('Failed to analyze document. Please try again.');
  }
};

/**
 * Generate health insights and recommendations
 */
export const generateHealthInsights = async (
  records: MedicalRecord[]
): Promise<string> => {
  try {
    const medicalData = records.map(record => ({
      date: record.date,
      type: record.type,
      title: record.title,
      diagnosis: record.diagnosis || [],
      medications: record.medications || [],
    }));

    const prompt = `Based on these medical records, provide personalized health insights and recommendations:

${JSON.stringify(medicalData, null, 2)}

Please provide:
1. **Health Trends** - Any patterns or trends in the medical history
2. **Risk Factors** - Potential health risks to be aware of
3. **Preventive Care** - Recommended preventive measures
4. **Lifestyle Recommendations** - Diet, exercise, or lifestyle suggestions
5. **Questions to Ask Doctor** - Important questions for the next doctor visit

Keep recommendations general and always note that this is for informational purposes only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    return insights;
  } catch (error) {
    console.error('Error generating health insights:', error);
    throw new Error('Failed to generate health insights. Please try again.');
  }
};

/**
 * Extract text from medical document for AI analysis (OCR simulation)
 */
export const extractTextFromDocument = async (
  imageBase64: string
): Promise<string> => {
  try {
    // For image-based documents, use Gemini's vision capabilities
    const prompt = `Extract all text from this medical document image. Identify and list:
- Document type
- Date (if visible)
- Patient information (if visible)
- Key medical findings
- Prescriptions or recommendations
- Any other important information

Provide the extracted information in a structured format.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const extractedText = response.text();

    return extractedText;
  } catch (error) {
    console.error('Error extracting text from document:', error);
    throw new Error('Failed to extract text from document. Please try again.');
  }
};

/**
 * Check if Gemini API is configured
 */
export const isGeminiConfigured = (): boolean => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
};

/**
 * Generate a doctor-friendly summary for sharing
 */
export const generateDoctorSummary = async (
  records: MedicalRecord[],
  patientName: string
): Promise<string> => {
  try {
    const medicalData = records.map(record => ({
      date: record.date,
      type: record.type,
      title: record.title,
      description: record.description || '',
      provider: record.provider || '',
      medications: record.medications || [],
      diagnosis: record.diagnosis || [],
    }));

    const prompt = `Generate a professional medical summary for healthcare provider review:

Patient: ${patientName}
Medical Records:
${JSON.stringify(medicalData, null, 2)}

Please provide a concise, professional summary including:
1. **Patient History Summary** - Key medical history points
2. **Current Conditions** - Active diagnoses and conditions
3. **Current Medications** - List of medications with dosages if available
4. **Recent Medical Events** - Significant recent medical events in chronological order
5. **Relevant Notes** - Any important clinical notes

Format this as a professional medical summary suitable for physician review.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error('Error generating doctor summary:', error);
    throw new Error('Failed to generate doctor summary. Please try again.');
  }
};
