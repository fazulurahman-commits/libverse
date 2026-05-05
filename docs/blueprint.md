# **App Name**: LibVerse

## Core Features:

- Authentication & Authorization: Secure user login for members and administrators, with role-based access to specific features.
- Book Catalog Management: Librarians can add, edit, and delete book records, including title, author, ISBN, category, total copies, available copies, and location using Firestore.
- Member & Role Management: Librarians can register new members, view their details, and assign roles (admin/user) within the Firebase backend.
- Book Lending & Return System: Librarians can issue books to members and mark books as returned, automatically updating the available copy count in Firestore.
- Automated Fine Calculation: Automatically calculate fines for overdue books based on return dates recorded in Firestore.
- Public Searchable Catalog (OPAC): Users can search the library's catalog by title, author, or category, and view real-time availability status.
- Personal User Dashboard: Members can access a personalized profile dashboard to view their currently borrowed books, due dates, and transaction history from Firestore.

## Style Guidelines:

- Primary color: A deep, thoughtful blue (#297BA3) to convey intellect and reliability, providing strong contrast on a light background.
- Background color: A very light, desaturated blue (#F0F3F5) providing a clean and calm canvas that gently aligns with the primary hue.
- Accent color: A fresh and vibrant aqua (#52E0C8) to draw attention to interactive elements and highlights, complementing the primary blue.
- Headline font: 'Alegreya' (serif) for an elegant, intellectual feel fitting for a library context. Body font: 'Inter' (sans-serif) for clean, objective readability of longer texts and data tables.
- Use a consistent set of simple, recognizable vector icons related to library functions (e.g., book, magnifying glass, user, calendar) to ensure clear navigation.
- Employ a clean, structured, and responsive layout that adapts gracefully to both large screens for administrators and smaller screens for members accessing the catalog on the go. Admin dashboards will use clear cards and tables, while user interfaces will prioritize search and readability.
- Implement subtle, fast transitions for navigation between pages and gentle hover effects on interactive elements to provide a smooth and professional user experience without distraction.