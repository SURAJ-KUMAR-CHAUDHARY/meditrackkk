# Meditrack

Meditrack is a comprehensive medical record management system designed to bridge the gap between patients and doctors. This project features the **MediTrack QR Module**, a seamless workflow allowing patients to securely upload medical reports and doctors to instantly review them via QR code scanning.

## 🚀 Key Features

### For Patients
- **Secure Document Upload:** Easy-to-use drag-and-drop interface for uploading medical reports (PDFs and Images).
- **Instant QR Generation:** Automatically generates a unique QR code for each uploaded document.
- **Privacy Focused:** Secure handling of personal health information (simulated in this demo).

### For Doctors
- **Integrated QR Scanner:** Built-in camera scanner to instantly access patient records from the dashboard.
- **Split-Screen Review:** Advanced review interface displaying the patient's medical report alongside a structured feedback form.
- **Quick Actions:** One-click suggestions for common tasks like follow-ups or prescription renewals.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 with Vite & TypeScript
- **UI/UX:** Tailwind CSS, shadcn/ui, Framer Motion (for animations)
- **Storage:** AWS S3 (with Mock Storage fallback for demonstration)
- **Libraries:**
  - `react-qr-code`: For generating patient QR codes.
  - `react-qr-reader`: For in-app QR code scanning.
  - `react-pdf`: For rendering PDF medical reports in the browser.

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd life-record-link
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # Note: If you encounter peer dependency conflicts with React 18 packages:
   npm install --legacy-peer-deps
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with your AWS credentials.
   *(If skipped, the application defaults to a Mock Storage Service for easy testing)*
   
   ```env
   VITE_AWS_REGION=your-aws-region
   VITE_AWS_ACCESS_KEY_ID=your-access-key-id
   VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
   VITE_AWS_S3_BUCKET=your-s3-bucket-name
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔄 Usage Workflow

1. **Patient Upload:**
   - Navigate to `/patient/upload`.
   - Upload a file (PDF/Image).
   - The system simulates an upload and generates a QR code.

2. **Doctor Scan:**
   - Navigate to `/doctor/scan` (or access via Doctor Dashboard).
   - Use your device's camera to scan the patient's QR code.
   - **Note:** For testing without a camera, you can manually navigate to the URL encoded in the QR code.

3. **Doctor Review:**
   - The system redirects to `/doctor/review/:reportId`.
   - View the uploaded document on the left.
   - Enter diagnosis and notes on the right.
   - Click "Submit Review" to complete the process.

## 📂 Project Structure

- `src/pages/PatientUpload.tsx`: Patient upload interface with QR generation.
- `src/pages/DoctorScanner.tsx`: QR code scanner implementation.
- `src/pages/DoctorReview.tsx`: Split-screen document viewer and feedback form.
- `src/services/aws-s3.service.ts`: AWS S3 integration logic.
- `src/services/mock-storage.service.ts`: Mock service for demonstration purposes.

---
*Built with ❤️ for better healthcare connectivity.*
