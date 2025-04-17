# CabShare-IITH

CabShare-IITH is a web application developed using Next.js and Chakra UI for the frontend, and Firebase for the backend. It provides a platform for members of IIT Hyderabad to share cab rides, helping them find fellow passengers and reduce commuting costs.

## Technologies Used

- **Next.js**: Next.js is a React framework that provides server-side rendering (SSR) and other useful features for building scalable web applications. We chose Next.js for its performance benefits and ease of implementation.
- **Chakra UI**: Chakra UI is a popular component library for building user interfaces with React. It offers a set of customizable and accessible UI components that helped us create a consistent and visually appealing design.
- **Firebase**: Firebase is a backend-as-a-service (BaaS) platform that provides various services like database, authentication, and hosting. We utilized Firebase's Firestore database for storing cab listings and user information and Firebase Authentication for user authentication and authorization.

## Screenshots

![App Screenshot](https://github.com/BhinTatta/cabshareIITH/blob/main/screenshots/Untitled%20design%20(1).png?raw=true)

## Features

- **Cab Listings**: Users can create and browse cab listings for different dates and destinations. Each listing contains information such as start place, destination, date, time, and contact details of the listing creator.
- **Search Listings**: Users can search for cab listings based on a specific date. This feature allows users to find relevant cab options for their preferred travel date.
- **User Authentication**: Users can sign up and log in to their accounts to create and manage cab listings by Google SignIn. Authentication helps maintain data security and ensures that only authorized users can create and modify their listings.
- **Clipboard Copy**: Users can easily copy the phone number and email address of a listing creator to their device's clipboard with a single click, making it convenient to contact the creator.

## Workflow and Data Sharing

1. User Registration: Users can create an account or log in to their existing account using their Google Account. Firebase Authentication securely manages user registration and authentication processes.
2. Cab Listing Creation: Authenticated users can create a cab listing by providing details such as start place, destination, date, time, and contact information. The listing is stored in the Firebase Firestore database in the "listings" collection.
3. Cab Listing Display: The application retrieves cab listings from the "listings" collection in the Firestore database and displays them in an organized manner, allowing users to browse and search for relevant listings.
4. Contacting Listing Creator: Users can copy the phone number or email address of a listing creator to their clipboard and contact them directly to coordinate their cab sharing plans.

## Challenges Faced
- **Synchronizing Data in Multiple Collections**: To improve performance and efficiently load user profiles, we divided the data into two collections: "listings" and "users". This approach helped us load user profiles without searching through all the listings. However, it required synchronous creation, update, and deletion of listings in both collections to maintain data consistency.
- **Implementing Server-Side Rendering (SSR)**: Initially, we faced challenges while integrating server-side rendering into our Next.js application. However, with the help of the Next.js framework and thorough documentation, we were able to implement SSR successfully.
- **Managing Mobile and Web UI**: We encountered difficulties in ensuring a seamless user experience on both mobile and web platforms. Through responsive design techniques and media queries, we were able to optimize the UI for different devices and screen sizes.

## Getting Started

To run the CabShare-IITH project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/CabShare-IITH.git`
2. Install dependencies: `cd CabShare-IITH` and `npm install`
3. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore database and Authentication services in the Firebase project
   - Obtain the Firebase configuration values and update them in the project's `.env.local` file
4. Add your firebase configuration to the `./firebase` component
5. Start the development server: `npm run dev`
6. Open the application in your browser at `http://localhost:3000`

## Contributing

I welcome contributions to enhance the features and functionality of CabShare-IITH. If you have any suggestions, bug fixes, or new feature implementations, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or need further assistance, please reach out to me:

- Kartik Kalia - https://www.linkedin.com/in/kartik-kalia-78276314b/

