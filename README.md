# CabShare-IITK

CabShare-IITK is a web application developed using Next.js and Chakra UI for the frontend, and Firebase for the backend. It provides a platform for members of IIT Kanpur to share cab rides, helping them find fellow passengers and reduce commuting costs.

## Getting Started

To run the CabShareIITK project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/aka-hemsa/CabShareIITK.git`
2. Install dependencies: `cd CabShareIITK` and `npm install`
3. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore database and Authentication services in the Firebase project
   - Obtain the Firebase configuration values and update them in the project's `.env.local` file
4. Add your firebase configuration to the `./firebase` component
5. Start the development server: `npm run dev`
6. Open the application in your browser at `http://localhost:3000`

## Contributing

I welcome contributions to enhance the features and functionality of CabShareIITK. If you have any suggestions, bug fixes, or new feature implementations, feel free to open an issue or submit a pull request.
