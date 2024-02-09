const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add other Firebase configuration options if needed
});

// Get the Auth service for managing users
const auth = admin.auth();

// Assign custom claims to a user
const uid = 'dWCRgn3hGFY4MZOuHBUOGBMOC483'; // Replace with the user's UID
const customClaims = { admin: true };

auth.setCustomUserClaims(uid, customClaims)
  .then(() => {
    console.log('Custom claims updated successfully');
  })
  .catch((error) => {
    console.error('Error updating custom claims:', error);
  });