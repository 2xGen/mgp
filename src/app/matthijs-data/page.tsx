

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useRouter } from 'next/navigation';
import { getAdminDashboardData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Users, DollarSign, Clock, CheckCircle, MapPin, TrendingUp, Star, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const PLAN_PRICES = {
    starter: 29,
    growth: 49,
    enterprise: 99,
};

interface AdminData {
    users: any[];
    subscriptions: any[];
}

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function AdminPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<AdminData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }
        if (!user) {
            router.push('/login');
            return;
        }
    }, [user, isAuthLoading, router]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const result = await getAdminDashboardData(password);
        if (result.error) {
            setError(result.error);
        } else {
            setData(result.data);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    };

    const combinedData = useMemo(() => {
        if (!data) return [];
        
        const subscriptionMap = new Map(data.subscriptions.map(s => [s.userId, s]));

        return data.users.map(u => {
            const subscription = subscriptionMap.get(u.uid);
            return {
                ...u,
                subscription,
            };
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    }, [data]);

    const summaryStats = useMemo(() => {
        if (!data) return { totalUsers: 0, trialing: 0, active: 0, mrr: 0, totalManagedLocations: 0, starter_trialing: 0, growth_trialing: 0, enterprise_trialing: 0, starter_active: 0, growth_active: 0, enterprise_active: 0 };
        
        const trialing = data.subscriptions.filter(s => s.status === 'trialing').length;
        const active = data.subscriptions.filter(s => s.status === 'active').length;
        
        const mrr = data.subscriptions
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + (PLAN_PRICES[s.planId as keyof typeof PLAN_PRICES] || 0), 0);
            
        const totalManagedLocations = data.users.reduce((sum, u) => sum + (u.managedLocations || 0), 0);

        const starter_trialing = data.subscriptions.filter(s => s.planId === 'starter' && s.status === 'trialing').length;
        const growth_trialing = data.subscriptions.filter(s => s.planId === 'growth' && s.status === 'trialing').length;
        const enterprise_trialing = data.subscriptions.filter(s => s.planId === 'enterprise' && s.status === 'trialing').length;
        const starter_active = data.subscriptions.filter(s => s.planId === 'starter' && s.status === 'active').length;
        const growth_active = data.subscriptions.filter(s => s.planId === 'growth' && s.status === 'active').length;
        const enterprise_active = data.subscriptions.filter(s => s.planId === 'enterprise' && s.status === 'active').length;

        return {
            totalUsers: data.users.length,
            trialing,
            active,
            mrr,
            totalManagedLocations,
            starter_trialing,
            growth_trialing,
            enterprise_trialing,
            starter_active,
            growth_active,
            enterprise_active,
        };
    }, [data]);

    if (isAuthLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/40">
                <Card className="w-full max-w-sm">
                    <form onSubmit={handlePasswordSubmit}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock /> Admin Access</CardTitle>
                            <CardDescription>Enter the password to view the admin dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Access Denied</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Unlock
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        );
    }
    

    if (!data) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <header className="bg-background border-b p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </header>
            <main className="p-4 sm:p-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Users" value={summaryStats.totalUsers} icon={Users} />
                    <StatCard title="Total Active Trials" value={summaryStats.trialing} icon={Clock} />
                    <StatCard title="Total Paid Subscriptions" value={summaryStats.active} icon={CheckCircle} />
                    <StatCard title="Total Managed Locations" value={summaryStats.totalManagedLocations} icon={MapPin} />
                    <StatCard title="Expected MRR" value={`$${summaryStats.mrr.toFixed(2)}`} icon={DollarSign} />
                </div>
                 <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <StatCard title="Starter (Trials)" value={summaryStats.starter_trialing} icon={Star} />
                    <StatCard title="Starter (Paid)" value={summaryStats.starter_active} icon={Star} />
                    <StatCard title="Growth (Trials)" value={summaryStats.growth_trialing} icon={TrendingUp} />
                    <StatCard title="Growth (Paid)" value={summaryStats.growth_active} icon={TrendingUp} />
                    <StatCard title="Enterprise (Trials)" value={summaryStats.enterprise_trialing} icon={TrendingUp} />
                    <StatCard title="Enterprise (Paid)" value={summaryStats.enterprise_active} icon={TrendingUp} />
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>A list of all users in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Managed Locations</TableHead>
                                    <TableHead>Subscriber Since</TableHead>
                                    <TableHead>Subscription End</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {combinedData.map(user => (
                                    <TableRow key={user.uid}>
                                        <TableCell>
                                            <div className="font-medium">{user.displayName}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="capitalize">{user.subscription?.planId || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                user.subscription?.status === 'active' ? 'default' 
                                                : user.subscription?.status === 'trialing' ? 'secondary' 
                                                : 'outline'
                                            } className="capitalize">
                                                {user.subscription?.status || 'No Plan'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.managedLocations}</TableCell>
                                        <TableCell>
                                            {user.subscription?.created_at ? format(new Date(user.subscription.created_at), 'MMM d, yyyy') : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {user.subscription?.current_period_end ? format(new Date(user.subscription.current_period_end), 'MMM d, yyyy') : 'N/A'}
                                        </TableCell>
                                        <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

