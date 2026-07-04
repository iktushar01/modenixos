"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminNoticeSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Notices</CardTitle>
        <CardDescription>Configure system-wide announcements for store owners.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon.</p>
      </CardContent>
    </Card>
  );
};

export default AdminNoticeSettings;
