"use client";
 
import { CircleAlert } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
 
export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/items';
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
 
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    <p>
                        Enter your details below to login to your account
                    </p>
                    <div aria-live="polite" aria-atomic="true">
                        {errorMessage && (
                            <div className="flex items-center mt-4">
                                <CircleAlert className="mr-4 h-4 w-4 text-red-500" />
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </div>
                        )}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="login-form" action={formAction}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="m@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" />
                        </div>
                    </div>
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" form="login-form" aria-disabled={isPending}>
                    Login
                </Button>
            </CardFooter>
        </Card>
    );
}