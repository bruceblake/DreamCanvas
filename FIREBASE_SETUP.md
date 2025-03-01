# Firebase Setup Instructions

## Set up Firestore Security Rules

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project: "dreamcanvas-d52d4"
3. In the left sidebar, click on "Firestore Database"
4. Click on the "Rules" tab
5. Replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth \!= null && request.auth.uid == userId;
      
      // Allow users to read and write their own images
      match /images/{imageId} {
        allow read, write: if request.auth \!= null && request.auth.uid == userId;
      }
    }
    
    // For testing only - REMOVE BEFORE PRODUCTION
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Click "Publish" to deploy the rules

## Set up Authentication

1. In the Firebase Console, click on "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable the following providers:
   - Email/Password
   - Google

## Set up Firestore Indexes (if needed)

If you encounter any query errors later, you may need to create indexes:
1. Click on the error link in your console logs
2. Click "Create Index" in the Firebase Console

## Security Warning

The rules above include a line that allows full read/write access to your database. This is for **testing only**. 

Once your app is working correctly, update the rules to remove this line:
```
// REMOVE THIS LINE BEFORE PRODUCTION
match /{document=**} {
  allow read, write: if true;
}
```

And replace it with:
```
// Default deny rule
match /{document=**} {
  allow read, write: false;
}
```
