import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AzureAdGuard } from './azure-ad.guard';

@Injectable()
export class MainGuard implements CanActivate {
    constructor(
        private readonly jwtGuard: JwtAuthGuard,
        private readonly azureGuard: AzureAdGuard,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Try local JWT first
        try {
            const jwtResult = await Promise.resolve(
                this.jwtGuard.canActivate(context),
            );
            if (jwtResult) {
                return true;
            }
        } catch (err: any) {
            // If you want to treat "jwt expired" specially:
            const message = err?.message ?? '';
            if (message.includes('jwt expired')) {
                // same behavior as your Express code:
                throw new UnauthorizedException('Invalid or expired token');
            }
            // Otherwise fall through and try Azure
        }

        // 2. Fallback to Azure AD
        const azureResult = await Promise.resolve(
            this.azureGuard.canActivate(context),
        );

        if (!azureResult) {
            throw new UnauthorizedException('Unauthenticated');
        }
        return true;
    }
}
