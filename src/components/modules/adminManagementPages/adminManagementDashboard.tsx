"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminManagementDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Management</h1>
        <p className="text-muted-foreground">Manage stores, users, and platform settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stores & Users</CardTitle>
          <CardDescription>Platform management tools will appear here as features are built.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Use the admin dashboard to monitor platform activity.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagementDashboard;
