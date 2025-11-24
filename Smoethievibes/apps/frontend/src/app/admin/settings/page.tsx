"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Manage your store preferences, appearance, and notifications.
      </p>

      {/* ---------- General Settings ---------- */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">General</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Store Name</label>
            <Input placeholder="Smoethie Vibe Store" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Contact Email</label>
            <Input placeholder="admin@smoethievibe.com" />
          </div>

          <Button className="mt-2">Save Changes</Button>
        </CardContent>
      </Card>


      {/* ---------- Appearance ---------- */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Dark Mode</p>
            <Switch />
          </div>
        </CardContent>
      </Card>


      {/* ---------- Notifications ---------- */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Notifications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Alerts</p>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">Stock Warnings</p>
            <Switch />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
