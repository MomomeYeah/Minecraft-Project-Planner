import type { Metadata } from "next";

import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
 
export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center h-full">
            <Suspense>
                <LoginForm />
            </Suspense>
    </main>
  );
}