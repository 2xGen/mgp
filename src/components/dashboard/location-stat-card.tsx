"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationStatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
}

export default function LocationStatCard({ title, value, icon: Icon }: LocationStatCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
            </CardContent>
        </Card>
    );
}
