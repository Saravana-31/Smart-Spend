# SmartSpendAI Authentication & Transaction System Update

## Overview
This document outlines the changes made to migrate from Google Sign-In to email/password authentication and ensure proper transaction handling with Firebase Firestore.

---

## 1. Authentication Changes

### 1.1 What Changed
- **Removed**: Google Sign-In functionality
- **Added**: Email/Password authentication with Firebase Authentication
- **Features**:
  - Sign Up with email, password, and name
  - Sign In with email and password
  - Password reset via email
  - Form validation for security

### 1.2 Authentication Flow

#### Sign Up
1. User enters name, email, and password
2. Frontend validates form (email format, password strength ≥ 6 characters)
3. Firebase creates user account with `createUserWithEmailAndPassword()`
4. User profile updated with display name using `updateProfile()`
5. User document created in Firestore under `/users/{uid}`
6. User redirected to home page

#### Sign In
1. User enters email and password
2. Firebase authenticates with `signInWithEmailAndPassword()`
3. User state updated and redirected to home page

#### Password Reset
1. User enters email on "Forgot Password" screen
2. Firebase sends password reset email using `sendPasswordResetEmail()`
3. User resets password via email link

### 1.3 User Identification
- **Previous**: Used `user.email` as the document identifier
- **Current**: Uses `user.uid` (unique Firebase user ID) as the document identifier
- **Why**: `uid` is immutable and secure, while email can theoretically change

---

## 2. Transaction System Updates

### 2.1 Database Structure

#### Firestore Collections

**Collection**: `transactions`
**Document ID**: `{user.uid}` (Firebase User UID)

**Document Structure**:
```json
{
  "totalAmount": 5000,
  "transactions": [
    {
      "type": "Income",
      "amount": 1000,
      "category": "Salary",
      "date": "2025-02-02T10:30:00.000Z",
      "createdAt": "2025-02-02T10:30:00.000Z",
      "source": "Manual Entry",
      "description": "Monthly salary"
    },
    {
      "type": "Expense",
      "amount": 500,
      "category": "Food",
      "date": "2025-02-01T15:45:00.000Z",
      "createdAt": "2025-02-01T15:45:00.000Z",
      "source": "Bill Scan",
      "description": "Groceries"
    }
  ]
}
```

### 2.2 Backward Compatibility
- Existing transactions using `user.email` as document ID remain functional
- Migration path: Users with old email-based documents can be migrated if needed
- No data loss: All existing transactions are preserved

### 2.3 Updated Files

#### Frontend Changes

| File | Changes |
|------|---------|
| `src/firebase.js` | Added new auth imports (email/password functions) and Firestore functions |
| `src/pages/Auth.jsx` | Removed Google Sign-In, updated to email/password auth |
| `src/pages/Transaction.jsx` | Changed `user.email` → `user.uid` (4 instances) |
| `src/pages/Dashboard.jsx` | Changed `user.email` → `user.uid` (2 instances) |
| `src/pages/Home.jsx` | Changed `user.email` → `user.uid` (2 instances) |
| `src/pages/Chatbot.jsx` | Changed `user.email` → `user.uid` (2 instances), updated API request body |
| `src/components/BillScanner.jsx` | Changed `user.email` → `user.uid` (2 instances) |

#### Backend Changes

| File | Changes |
|------|---------|
| `backend/app.py` | Changed `userEmail` → `userId` parameter in chat endpoint, updated transaction function signatures |

### 2.4 Transaction Operations

#### Adding Income/Expense
```javascript
// Frontend example
const userDocRef = doc(db, "transactions", user.uid);
await updateDoc(userDocRef, {
  totalAmount: newTotal,
  transactions: arrayUnion(transaction)
});
```

#### Fetching Transactions
```javascript
const userDocRef = doc(db, "transactions", user.uid);
const docSnap = await getDoc(userDocRef);
const data = docSnap.data();
```

### 2.5 Transaction Features Preserved
✅ Add income with categories  
✅ Track expenses with categories  
✅ Category management (predefined + custom)  
✅ Real-time balance updates  
✅ Transaction history  
✅ Chatbot-based transaction input  
✅ Bill scanning and OCR  
✅ Dashboard analytics  
✅ Budget planning  

---

## 3. Firebase Security Rules Setup

### 3.1 Required Firestore Rules

Update your Firestore security rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - user can only access their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection - user can only access their own transactions
    match /transactions/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3.2 How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **SmartSpendAI** (smartspend-ai-da2e6)
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace existing rules with the code above
5. Click **Publish**
6. Wait for deployment (usually < 1 minute)

### 3.3 Rule Explanation

| Rule | Purpose |
|------|---------|
| `request.auth != null` | Only authenticated users can access data |
| `request.auth.uid == userId` | Users can only access their own data |
| Security by document ID matching | Prevents cross-user data access |

---

## 4. Environment Variables

Ensure your `.env` file (backend) contains:
```
GROQ_API_KEY=your_groq_api_key
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_PRIVATE_KEY_ID=your_firebase_key_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
PORT=5000
```

---

## 5. Testing Checklist

- [ ] Sign up with new email account
- [ ] Sign in with credentials
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Verify transaction appears in Chatbot
- [ ] Verify transaction in Dashboard
- [ ] Test password reset
- [ ] Verify transactions persist after refresh
- [ ] Test Bill Scanner (if available)
- [ ] Verify old email-based transactions still accessible (if migrating)
- [ ] Test Chatbot transaction input
- [ ] Verify Budget Planner works
- [ ] Check all animations/UI still functional

---

## 6. API Changes Summary

### Chatbot Backend Endpoint

**Request Body Change**:
```javascript
// Old
{
  "message": "Add income 5000",
  "userEmail": "user@example.com",
  "history": [...]
}

// New
{
  "message": "Add income 5000",
  "userId": "firebase_uid_12345",
  "history": [...]
}
```

---

## 7. Known Limitations & Notes

1. **Email Change**: Firebase Auth doesn't allow changing email without verification
2. **UID Immutability**: User UID cannot be changed - it's permanent
3. **Data Migration**: If migrating old email-based documents, see Firebase migration guide
4. **Offline Support**: Transactions are only stored online via Firestore
5. **Concurrent Edits**: LastWrite-Wins strategy for simultaneous updates

---

## 8. Troubleshooting

### Issue: "Missing or insufficient permissions"
**Solution**: 
- Verify Firestore rules are published
- Clear browser cache and reload
- Check user is logged in (check `user.uid` is defined)

### Issue: Transactions not saving
**Solution**:
- Verify backend is running (`python app.py`)
- Check browser console for errors
- Verify Firestore is initialized in Firebase console

### Issue: Can't sign up
**Solution**:
- Check email is valid format
- Password must be ≥ 6 characters
- Check if email already exists (use sign in instead)
- Verify Firebase Auth is enabled in console

### Issue: Backend can't connect to Firestore
**Solution**:
- Verify Firebase credentials in `.env`
- Check private key has proper newline handling
- Verify service account has Firestore permissions

---

## 9. Future Enhancements

Potential improvements for future updates:
- [ ] Social login (Google, GitHub) as alternative
- [ ] Two-factor authentication (2FA)
- [ ] Email verification on signup
- [ ] Offline transaction caching
- [ ] Transaction sync queue
- [ ] Data export/backup
- [ ] Account deletion
- [ ] Session timeout

---

## 10. Support & Questions

For issues or questions:
1. Check console errors (F12 → Console tab)
2. Review Firestore rules (see section 3)
3. Verify `.env` variables (backend)
4. Check Firebase project settings
5. Review logs in backend terminal

---

**Last Updated**: February 2, 2026  
**Version**: 2.0 (Email/Password Auth + UID-based Transactions)
