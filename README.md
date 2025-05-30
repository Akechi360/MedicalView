MedicalView

Esta es una aplicación Next.js diseñada para que los profesionales médicos administren pacientes, citas, historial médico, resultados de laboratorio y estudios DICOM. Cuenta con capacidades de diagnóstico asistido por IA.
Para Empezar

Para comenzar con el desarrollo:

    Instalar dependencias:
    Bash

npm install
# o
yarn install

Configurar Variables de Entorno:
Crea un archivo .env.local en la raíz de tu proyecto y agrega las variables de entorno necesarias. Para Firebase, estas incluirían la configuración de tu proyecto de Firebase. Para el esquema de Prisma, necesitarás DATABASE_URL_PLACEHOLDER_MEDIVIEW_HUB.
Ejemplo de .env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Reemplaza con tu cadena de conexión real de PostgreSQL para Prisma
DATABASE_URL_PLACEHOLDER_MEDIVIEW_HUB="postgresql://usuario:contraseña@host:puerto/basededatos?schema=public"

Ejecutar el servidor de desarrollo:
Bash

    npm run dev
    # o
    yarn dev

    La aplicación estará disponible en http://localhost:9002.

Características Principales

    Gestión de Pacientes: Gestión segura de perfiles de pacientes, incluyendo creación, edición y búsqueda.
    Gestión de Citas: Programación de citas y visualización en calendario.
    Historial Médico: Registro detallado del historial médico, incluyendo notas de visita e informes adjuntos.
    Gestión de Resultados de Laboratorio: Registro y visualización de resultados de laboratorio con archivos adjuntos.
    Visor DICOM: Carga segura y visualización básica de estudios DICOM (marcador de posición de la interfaz de usuario).
    Diagnóstico Asistido por IA: Sugiere posibles diagnósticos o próximos pasos basados en los datos del paciente.

Sugerencias para la Integración del Visor DICOM

La aplicación incluye una interfaz de usuario de marcador de posición para la gestión de estudios DICOM. Para capacidades completas de visualización DICOM en el frontend, considera integrar una de las siguientes bibliotecas:

    Cornerstone.js: Una popular biblioteca de JavaScript de código abierto para mostrar imágenes médicas (DICOM, etc.) en navegadores web. Proporciona funcionalidades básicas para renderizar y manipular imágenes.
        Sitio web: https://cornerstonejs.org/
    OHIF Viewer: Construido sobre Cornerstone.js, OHIF (Open Health Imaging Foundation) Viewer proporciona un marco de aplicación de visor de imágenes médicas más completo, extensible y listo para producción.
        Sitio web: https://ohif.org/
    DWV (DICOM Web Viewer): Un visor DICOM puro de JavaScript/HTML5 que se puede incrustar fácilmente en aplicaciones web. Admite varias modalidades y herramientas DICOM.
        GitHub: https://github.com/ivmartel/dwv

Consideraciones para el Manejo de DICOM:

    Rendimiento: Los archivos DICOM pueden ser grandes. La renderización directa de archivos .dcm sin procesar en el navegador puede consumir mucho rendimiento.
    Vistas Previas Aptas para la Web: Considera la conversión del lado del servidor de archivos DICOM (o series/instancias seleccionadas) a formatos aptos para la web como JPEG o PNG para vistas previas rápidas o miniaturas. Herramientas como dcmtk (específicamente dcmj2pnm o dcm2jpg) u otras bibliotecas de procesamiento DICOM se pueden usar en una Cloud Function o servicio de backend para este propósito.
    Seguridad: Asegúrate de que los archivos DICOM, al ser datos médicos sensibles, se almacenen de forma segura (por ejemplo, en Firebase Cloud Storage con reglas de seguridad apropiadas) y solo sean accesibles por usuarios autorizados.

Estructura de Firebase (Conceptual)

    Colecciones de Firestore:
        users: Almacena perfiles de médicos/administradores.
        patients: Almacena perfiles de pacientes.
            Subcolecciones dentro de patients/{patientId}/:
                medicalHistory: Entradas para visitas, notas.
                labResults: Resultados de pruebas de laboratorio.
                dicomStudies: Metadatos sobre estudios DICOM.
        appointments: Almacena detalles de las citas.
        auditLogs: Para rastrear acciones importantes.
    Cloud Storage:
        patients/{patientId}/medical_attachments/: Para PDFs, informes de texto relacionados con el historial médico o resultados de laboratorio.
        patients/{patientId}/dicom_studies/: Para almacenar archivos DICOM sin procesar.
        users/{userId}/profile/: Para imágenes de perfil de usuario (si aplica).

Esquema de Prisma para PostgreSQL

Se proporciona un archivo prisma/schema.prisma, que describe la estructura de la base de datos para una posible migración futura a PostgreSQL. Refleja las entidades y relaciones requeridas por la aplicación.
Seguridad

    Las reglas de Firebase Firestore y Cloud Storage se definen en firestore.rules y storage.rules respectivamente, con el objetivo de proteger los datos sensibles.
    La estructura de la aplicación está diseñada teniendo en cuenta las mejores prácticas de seguridad, pero una revisión y pruebas exhaustivas son cruciales antes de manejar datos reales de pacientes.

Este proyecto es un punto de partida. Se necesitará un mayor desarrollo para implementar la lógica completa del backend y las capacidades avanzadas de visualización DICOM.
