/**
 * Demo Examples for Diff-Focus Showcase
 * These are realistic Meta-style diffs for demonstration
 */

export const DEMO_EXAMPLES = {
  highRiskAuth: {
    name: "🔴 High Risk: Auth Bypass Change",
    description: "Security-critical authentication modification",
    diff: `diff --git a/fbcode/security/AuthGate.hh b/fbcode/security/AuthGate.hh
index abc123..def456 100644
--- a/fbcode/security/AuthGate.hh
+++ b/fbcode/security/AuthGate.hh
@@ -45,7 +45,8 @@ class AuthGate {
     if ($viewer->isAdmin()) {
-      return true; // Admin bypass
+      Auth::bypassAllChecks();
+      PrivacyCheck::skip();
+      return true; // Admin bypass
     }
     return $this->checkPermissions($viewer);
   }
`
  },

  highRiskDatabase: {
    name: "🔴 High Risk: Database Migration",
    description: "Destructive database operations",
    diff: `diff --git a/db/migrations/2024_remove_old_table.sql b/db/migrations/2024_remove_old_table.sql
new file mode 100644
--- /dev/null
+++ b/db/migrations/2024_remove_old_table.sql
@@ -0,0 +1,5 @@
+-- Migration: Remove old user sessions table
+DROP TABLE IF EXISTS user_sessions_old;
+ALTER TABLE user_sessions ADD COLUMN expires_at TIMESTAMP;
+DELETE FROM audit_log WHERE created_at < '2020-01-01';
+-- WARNING: This will delete historical audit data
`
  },

  lowRiskStyling: {
    name: "✅ Low Risk: UI Styling Update",
    description: "Harmless CSS/className change",
    diff: `diff --git a/www/js/components/Button.jsx b/www/js/components/Button.jsx
index 111..222 100644
--- a/www/js/components/Button.jsx
+++ b/www/js/components/Button.jsx
@@ -12,7 +12,7 @@ export function Button({ children, onClick }) {
       className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600"
+      className="px-4 py-2 rounded-md bg-[#0668E1] hover:bg-blue-700"
       onClick={onClick}
     >
       {children}
     </button>
`
  },

  mediumRiskLifecycle: {
    name: "⚠️ Medium Risk: React Lifecycle Change",
    description: "Component lifecycle modification",
    diff: `diff --git a/www/js/components/UserProfile.jsx b/www/js/components/UserProfile.jsx
index aaa..bbb 100644
--- a/www/js/components/UserProfile.jsx
+++ b/www/js/components/UserProfile.jsx
@@ -15,6 +15,12 @@ export function UserProfile({ userId }) {
   const [user, setUser] = useState(null);
 
+  useEffect(() => {
+    fetchUserData(userId).then(setUser);
+  }, [userId]);
+
+  componentDidMount() {
+    this.trackView('user_profile');
+  }
+
   return (
     <div className="profile-container">
`
  },

  debugCodeLeftBehind: {
    name: "ℹ️ Info: Debug Code Detected",
    description: "Console logs and debug statements",
    diff: `diff --git a/fbcode/graphql/UserResolver.hh b/fbcode/graphql/UserResolver.hh
index aaa..bbb 100644
--- a/fbcode/graphql/UserResolver.hh
+++ b/fbcode/graphql/UserResolver.hh
@@ -23,6 +23,8 @@ async function resolveUser($id) {
     $user = await User::load($id);
+    var_dump($user->toArray()); // DEBUG - remove before merge
+    console.log('User loaded:', $id);
+    // TODO: Add caching here
     return $user;
   }
`
  },

  complexMultiFile: {
    name: "📦 Complex: Multi-File Change",
    description: "Multiple file types, mixed risk",
    diff: `diff --git a/www/js/components/Feed.jsx b/www/js/components/Feed.jsx
index 111..222 100644
--- a/www/js/components/Feed.jsx
+++ b/www/js/components/Feed.jsx
@@ -10,6 +10,7 @@ export function Feed() {
+  useEffect(() => {
+    fetchFeedData();
+  }, []);
   return <div>Feed content</div>;
 }
 
diff --git a/fbcode/api/FeedController.hh b/fbcode/api/FeedController.hh
index aaa..bbb 100644
--- a/fbcode/api/FeedController.hh
+++ b/fbcode/api/FeedController.hh
@@ -5,6 +5,7 @@ class FeedController {
   public function getFeed() {
+    ViewerContext::requireAuth();
     return $this->feedService->getFeed();
   }
 }
`
  }
};



