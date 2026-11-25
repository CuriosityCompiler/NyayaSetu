import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = req;
    const clientIp = (headers['x-forwarded-for'] || ip || 'unknown').toString().split(',')[0].trim();

    return next.handle().pipe(
      tap(async () => {
        // Record audit logs for mutation requests performed by authenticated users
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && user?.id) {
          try {
            await this.prisma.auditLog.create({
              data: {
                actorId: user.id,
                action: `${method} ${url}`,
                entity: url.split('/')[3] || 'general',
                entityId: req.params?.id || 'collection',
                details: {
                  path: url,
                  bodyKeys: req.body ? Object.keys(req.body) : [],
                },
                ipAddress: clientIp,
              },
            });
          } catch (err: any) {
            this.logger.error(`Failed to write audit log: ${err.message}`);
          }
        }
      }),
    );
  }
}
