# MediView Hub

This is a Next.js application designed for medical professionals to manage patients, appointments, medical history, lab results, and DICOM studies. It features AI-assisted diagnosis capabilities.

## Getting Started

To get started with development:

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add necessary environment variables. For Firebase, these would include your Firebase project configuration. For the Prisma schema, you'll need `DATABASE_URL_PLACEHOLDER_MEDIVIEW_HUB`.
    Example `.env.local`:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Replace with your actual PostgreSQL connection string for Prisma
    DATABASE_URL_PLACEHOLDER_MEDIVIEW_HUB="postgresql://user:password@host:port/database?schema=public"
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:9002`.

## Core Features

*   **Patient Management**: Secure patient profile management, including creation, editing, and searching.
*   **Appointment Management**: Appointment scheduling and calendar visualization.
*   **Medical History**: Detailed medical history logging, including visit notes and attached reports.
*   **Lab Results Management**: Record and display lab results with attached files.
*   **DICOM Viewer**: Secure upload and basic viewing of DICOM studies (UI placeholder).
*   **AI-Assisted Diagnosis**: Suggest possible diagnoses or next steps based on patient data.

## DICOM Viewer Integration Suggestions

The application includes a placeholder UI for DICOM study management. For full DICOM viewing capabilities in the frontend, consider integrating one of the following libraries:

*   **Cornerstone.js**: A popular open-source JavaScript library for displaying medical images (DICOM, etc.) in web browsers. It provides core functionalities for rendering and manipulating images.
    *   Website: [https://cornerstonejs.org/](https://cornerstonejs.org/)
*   **OHIF Viewer**: Built on top of Cornerstone.js, OHIF (Open Health Imaging Foundation) Viewer provides a more complete, extensible, and production-ready medical imaging viewer application framework.
    *   Website: [https://ohif.org/](https://ohif.org/)
*   **DWV (DICOM Web Viewer)**: A pure JavaScript/HTML5 DICOM viewer that can be easily embedded into web applications. It supports various DICOM modalities and tools.
    *   GitHub: [https://github.com/ivmartel/dwv](https://github.com/ivmartel/dwv)

### Considerations for DICOM Handling:

*   **Performance**: DICOM files can be large. Direct rendering of raw `.dcm` files in the browser can be performance-intensive.
*   **Web-Friendly Previews**: Consider server-side conversion of DICOM files (or selected series/instances) to web-friendly formats like JPEG or PNG for quick previews or thumbnails. Tools like `dcmtk` (specifically `dcmj2pnm` or `dcm2jpg`) or other DICOM processing libraries can be used in a Cloud Function or backend service for this purpose.
*   **Security**: Ensure that DICOM files, being sensitive medical data, are stored securely (e.g., in Firebase Cloud Storage with appropriate security rules) and accessed only by authorized users.

## Firebase Structure (Conceptual)

*   **Firestore Collections**:
    *   `users`: Stores doctor/admin profiles.
    *   `patients`: Stores patient profiles.
        *   Subcollections within `patients/{patientId}/`:
            *   `medicalHistory`: Entries for visits, notes.
            *   `labResults`: Lab test results.
            *   `dicomStudies`: Metadata about DICOM studies.
    *   `appointments`: Stores appointment details.
    *   `auditLogs`: For tracking important actions.
*   **Cloud Storage**:
    *   `patients/{patientId}/medical_attachments/`: For PDFs, text reports related to medical history or lab results.
    *   `patients/{patientId}/dicom_studies/`: For storing raw DICOM files.
    *   `users/{userId}/profile/`: For user profile images (if applicable).

## Prisma Schema for PostgreSQL

A `prisma/schema.prisma` file is provided, outlining the database structure for a potential future migration to PostgreSQL. It reflects the entities and relationships required by the application.

## Security

*   Firebase Firestore and Cloud Storage rules are defined in `firestore.rules` and `storage.rules` respectively, aiming to protect sensitive data.
*   The application structure is designed with security best practices in mind, but thorough review and testing are crucial before handling real patient data.

This project is a starting point. Further development will be needed to implement full backend logic, Firebase integration, and advanced DICOM viewing capabilities.
