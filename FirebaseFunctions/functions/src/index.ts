import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

export const depositInitialCashOnUserSignup = functions.auth.user().onCreate(user => {
   const transactionsRef = admin.database().ref('transactions');
   return transactionsRef.push({
      quantity: -1,
      stockPrice: 10000,
      symbol: 'deposit',
      timestamp: Date.now(),
      uid: user.uid
    });
});
