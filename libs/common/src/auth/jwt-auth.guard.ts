import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { AUTH_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UserDto } from '../dto';

export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const Authentication = context.switchToHttp().getRequest().cookies?.Authentication as string;

    if (!Authentication) return false;

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication,
      })
      .pipe(
        tap((res) => (context.switchToHttp().getRequest().user = res)),
        map((res) => !!res),
        catchError(() => of(false)),
      );
  }
}
