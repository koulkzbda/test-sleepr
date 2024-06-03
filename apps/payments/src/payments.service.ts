import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-04-10',
  });

  constructor(private readonly configService: ConfigService) {}

  async createCharge({ amount }: CreateChargeDto): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
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
