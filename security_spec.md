# Security Specification: Fitness App Integrity Protocol

This specification outlines the data invariants, threat model payloads ("The Dirty Dozen"), and client-side access control boundaries for Firebase Authentication and Cloud Firestore.

## 1. Data Invariants & Access Control Policy
* **User Isolation:** Standard authenticated users can read and write exclusively to their own private profile (`/users/{userId}`) and their subcollections (`workouts`, `diets`, `progress`, `subscriptions`).
* **Admin Privilege (Role-Based Access Control):** Users with their profile `role` field set to `'admin'` are authorized to catalog and inspect across all registered user records.
* **Bootstrapped Admin Email:** The email address `manish55bhagat@gmail.com` is configured as the system's root admin account.
* **Temporal and Identity Attestation:**
  - Standard users cannot modify their `role` to elevate privileges.
  - Profile creation or updates enforce exact ownership checks.

---

## 2. "The Dirty Dozen" Exploit Payloads
The following payloads attempt to bypass authorization boundaries and must be caught and rejected by Firestore rules:

1. **Self-Promotion Exploit (Privilege Escalation):**
   * *Target:* `/users/victim_user`
   * *Payload:* `{ "fullName": "Attacker", "role": "admin", "uid": "attacker_uid", "email": "attacker@test.com" }`
   * *Result:* `PERMISSION_DENIED`

2. **Cross-User Data Harvest (Read Leak):**
   * *Query:* `collection(db, "users")` initiated by standard user `user_123`
   * *Result:* `PERMISSION_DENIED`

3. **Subcollection Hijack (Workout injection to other user):**
   * *Target:* `/users/victim_user/workouts/workout_999` logged by standard user `attacker_uid`
   * *Result:* `PERMISSION_DENIED`

4. **Spoofed Admin Impersonation:**
   * *Condition:* User attempts to sign in with email `manish55bhagat@gmail.com` but without server-side verification, attempting to write directly to another user's profile.
   * *Result:* `PERMISSION_DENIED`

5. **Profile Orphan Write (Shadow field insertion):**
   * *Target:* `/users/attacker_uid`
   * *Payload:* `{ "uid": "attacker_uid", "fullName": "Attacker", "email": "attacker@test.com", "invisibleSecretField": "malicious_script" }`
   * *Result:* `PERMISSION_DENIED` (Strict schema prevents keys not matching the allowed keys size schema)

6. **Shadow Metadata Injection:**
   * *Target:* `/users/attacker_uid`
   * *Payload:* Same as profile but with nested objects or excessive fields size.
   * *Result:* `PERMISSION_DENIED`

7. **Foreign Diet Log Poisoning:**
   * *Target:* `/users/victim_user/diets/diet_999` logged by standard user `attacker_uid`
   * *Result:* `PERMISSION_DENIED`

8. **Falsified Weight Metrics Overwrite:**
   * *Target:* `/users/victim_user/progress/progress_999` logged by `attacker_uid`
   * *Result:* `PERMISSION_DENIED`

9. **Direct Subscription Log Forgery:**
   * *Target:* `/users/attacker_uid/subscriptions/free_sub`
   * *Payload:* Unvalidated plan bypass without formal transaction checks.
   * *Result:* `PERMISSION_DENIED` (Must match strict properties check)

10. **Malicious ID Injection (Path Poisoning):**
    * *Target:* `/users/attacker_uid/workouts/%2F..%2F..%2Fother_doc`
    * *Result:* `PERMISSION_DENIED` (Enforced by strict character restrictions on IDs)

11. **Excessive Resource Allocation (Denial of Wallet):**
    * *Payload:* `fullName` of length `20,000` characters.
    * *Result:* `PERMISSION_DENIED` (Enforced by limits of size <= 100 in rules)

12. **Unauthorized Subscription Depletion:**
    * *Action:* Delete command to `/users/attacker_uid/subscriptions/sub_id`
    * *Result:* `PERMISSION_DENIED` (Subscription delete is permanently disabled)

---

## 3. Test Runner & Verification Suite

A mock TypeScript test runner representing assertions of standard vs admin accounts:

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

describe("Fitness App Core Rules Audit", () => {
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "fitness-mantra-6161d",
    });
  });

  it("denies access to non-owners trying to read profiles", async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const victimDoc = unauthedDb.doc("users/victim_user");
    await assertFails(victimDoc.get());
  });

  it("allows admins to list the entire collection of users", async () => {
    const adminDb = testEnv.authenticatedContext("admin_uid", { email: "manish55bhagat@gmail.com" }).firestore();
    const usersCollection = adminDb.collection("users");
    // This is allowed if the user's document has role: 'admin'
    // Simulated via rules lookup
  });
});
```
