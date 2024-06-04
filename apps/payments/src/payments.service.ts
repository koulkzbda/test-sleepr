import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-04-10',
  });

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy,
  ) {}

  async createCharge({ amount, email }: PaymentsCreateChargeDto): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    const text = `Your payment of ${amount} € has been accepted.`;
    return firstValueFrom(
      this.notificationsService.emit('notify_email', { email, text }).pipe(map(() => paymentIntent)),
    );
  }

  // async createCharge({ card, amount }: CreateChargeDto): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  //   const paymentMethod = await this.stripe.paymentMethods.create({
  //     type: 'card',
  //     card,
  //   });

  //   return await this.stripe.paymentIntents.create({
  //     payment_method: paymentMethod.id,
  //     amount: amount * 100,
  //     confirm: true,
  //     payment_method_types: ['card'],
  //     currency: 'eur',
  //   });
  // }
}
