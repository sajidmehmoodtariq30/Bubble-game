import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Construction } from 'lucide-react';

const SettingsPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
          <Construction className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle>Settings Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">User preferences and settings coming soon!</p>
      </CardContent>
    </Card>
  </div>
);

export default SettingsPage;
