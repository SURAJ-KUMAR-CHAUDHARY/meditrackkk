export interface MedicalEvent {
  id: string;
  date: string;
  type: 'diagnosis' | 'prescription' | 'report' | 'surgery' | 'vaccination' | 'checkup';
  title: string;
  description: string;
  doctor: string;
  hospital: string;
  attachments?: string[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  allergies: string[];
  currentMedications: string[];
  recentConditions: string[];
  avatar?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  accessGranted: boolean;
  accessExpiry?: string;
}

export const mockMedicalEvents: MedicalEvent[] = [
  {
    id: '1',
    date: '2024-12-01',
    type: 'checkup',
    title: 'Annual Physical Examination',
    description: 'Complete physical examination with blood work. All vitals normal. Cholesterol slightly elevated.',
    doctor: 'Dr. Sarah Mitchell',
    hospital: 'City General Hospital',
    attachments: ['blood_work_results.pdf'],
  },
  {
    id: '2',
    date: '2024-11-15',
    type: 'prescription',
    title: 'Hypertension Management',
    description: 'Prescribed Lisinopril 10mg daily for blood pressure management.',
    doctor: 'Dr. James Wilson',
    hospital: 'Heart Care Clinic',
  },
  {
    id: '3',
    date: '2024-10-20',
    type: 'report',
    title: 'ECG Report',
    description: 'Electrocardiogram results showing normal sinus rhythm. No abnormalities detected.',
    doctor: 'Dr. James Wilson',
    hospital: 'Heart Care Clinic',
    attachments: ['ecg_report.pdf'],
  },
  {
    id: '4',
    date: '2024-09-05',
    type: 'vaccination',
    title: 'Flu Vaccination',
    description: 'Annual influenza vaccination administered.',
    doctor: 'Dr. Emily Chen',
    hospital: 'Community Health Center',
  },
  {
    id: '5',
    date: '2024-08-10',
    type: 'diagnosis',
    title: 'Seasonal Allergies',
    description: 'Diagnosed with seasonal allergic rhinitis. Recommended antihistamines as needed.',
    doctor: 'Dr. Sarah Mitchell',
    hospital: 'City General Hospital',
  },
  {
    id: '6',
    date: '2023-03-15',
    type: 'surgery',
    title: 'Appendectomy',
    description: 'Laparoscopic appendectomy performed successfully. Recovery within expected parameters.',
    doctor: 'Dr. Michael Roberts',
    hospital: 'University Medical Center',
    attachments: ['surgery_report.pdf', 'discharge_summary.pdf'],
  },
];

export const mockPatient: Patient = {
  id: 'p1',
  name: 'Alex Johnson',
  age: 34,
  bloodType: 'O+',
  allergies: ['Penicillin', 'Shellfish'],
  currentMedications: ['Lisinopril 10mg', 'Vitamin D 1000IU'],
  recentConditions: ['Hypertension', 'Seasonal Allergies'],
};

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Mitchell',
    specialization: 'General Physician',
    hospital: 'City General Hospital',
    accessGranted: true,
    accessExpiry: '2025-01-15',
  },
  {
    id: 'd2',
    name: 'Dr. James Wilson',
    specialization: 'Cardiologist',
    hospital: 'Heart Care Clinic',
    accessGranted: true,
    accessExpiry: '2024-12-31',
  },
  {
    id: 'd3',
    name: 'Dr. Emily Chen',
    specialization: 'Immunologist',
    hospital: 'Community Health Center',
    accessGranted: false,
  },
  {
    id: 'd4',
    name: 'Dr. Michael Roberts',
    specialization: 'General Surgeon',
    hospital: 'University Medical Center',
    accessGranted: false,
  },
];

export const mockPatientsList: Patient[] = [
  {
    id: 'p1',
    name: 'Alex Johnson',
    age: 34,
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Lisinopril 10mg', 'Vitamin D 1000IU'],
    recentConditions: ['Hypertension', 'Seasonal Allergies'],
  },
  {
    id: 'p2',
    name: 'Maria Garcia',
    age: 45,
    bloodType: 'A-',
    allergies: ['Sulfa drugs'],
    currentMedications: ['Metformin 500mg', 'Aspirin 81mg'],
    recentConditions: ['Type 2 Diabetes', 'Osteoarthritis'],
  },
  {
    id: 'p3',
    name: 'David Kim',
    age: 28,
    bloodType: 'B+',
    allergies: [],
    currentMedications: [],
    recentConditions: ['Anxiety'],
  },
  {
    id: 'p4',
    name: 'Sarah Thompson',
    age: 62,
    bloodType: 'AB+',
    allergies: ['Latex', 'Ibuprofen'],
    currentMedications: ['Atorvastatin 20mg', 'Omeprazole 20mg'],
    recentConditions: ['GERD', 'High Cholesterol'],
  },
];

export const generateAISummary = (events: MedicalEvent[]): string => {
  return `**Patient Health Summary**

Based on the medical history analysis, this patient has been actively managing their health with regular checkups and preventive care.

**Key Observations:**
- Blood pressure management initiated with Lisinopril
- Successful appendectomy in 2023 with full recovery
- Up-to-date with vaccinations
- Mild seasonal allergies under control

**Risk Factors:**
- Slightly elevated cholesterol (recommend dietary modifications)
- Family history review suggested for cardiovascular conditions

**Recommendations:**
- Continue current medication regimen
- Schedule follow-up lipid panel in 3 months
- Maintain healthy lifestyle with regular exercise`;
};
