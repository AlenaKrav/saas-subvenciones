import { redirect } from '@tanstack/react-router';
import type { RouterContext } from '../routes/__root';

export function requireAuth(context: RouterContext) {
    if (context.inProgress !== 'none') {
        return;
    };
    if (!context.isAuthenticated) {
        throw redirect({
            to: '/login'
        });
    };
};

export function requireGuest(context: RouterContext) {
    if (context.inProgress !== 'none') {
        return;
    };
    if (context.isAuthenticated) {
        throw redirect({
            to: '/dashboard'
        });
    };
};