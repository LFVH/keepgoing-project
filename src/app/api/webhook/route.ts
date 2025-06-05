import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { logNow } from "@/utils/Logging";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret || !signature) {
      throw new Error("Missing secret or signature");
    }
    
    const event = stripe.webhooks.constructEvent(body, signature, secret!);

    switch (event.type) {
    case "checkout.session.completed":
    //TUDO NO INVOICE
    // const session = event.data.object;

    // if (session.mode === 'subscription' && session.payment_status === 'paid') {
    //   // 1. Dados básicos
    //   const userId = session.metadata?.userId;
    //   const stripeCustomerId = session.customer?.toString(); // cus_123
    //   const subscriptionId = session.subscription; // sub_123

    //   if (!userId || !stripeCustomerId || typeof subscriptionId !== 'string') {
    //     throw new Error("Missing required IDs or invalid subscription ID");
    //   }


    //   // 2. Buscar detalhes da assinatura
    //   const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    //   logNow("subscription")
    //   console.log(subscription)
    //   const priceId = subscription.items.data[0].price.id;
    //   const interval = subscription.items.data[0].plan.interval; // 'month', 'year'
    //   logNow("subscript items data 0 current end")
    //   console.log(subscription.items.data[0].current_period_end);
    //   const currentPeriodEnd = new Date((subscription.items.data[0].current_period_end) * 1000);
    //   logNow("currentPeriodEnd")
    //   console.log(currentPeriodEnd);
    //   const plano =  interval
    //   // 4. Atualizar banco de dados
    //   await prisma.usuario.update({
    //     where: { id: userId },
    //     data: {
    //       stripeCliId: stripeCustomerId,
    //       stripeSubId: subscriptionId,
    //       plano,
    //       dtIniPremium: new Date(),
    //       dtFimPremium: currentPeriodEnd,
    //       statusAss: "aberta",
    //     },
    //   });
    // }
    break;

    case "checkout.session.expired":
      if (event.data.object.payment_status === "unpaid") {
        // O cliente saiu do checkout e expirou :(
        const userId = event.data.object.metadata?.userId;
        console.log("checkout expirado", userId);
      }
    break;

    case "customer.subscription.deleted":
      await prisma.usuario.update({
        where: { stripeSubId: event.data.object.id },
        data: { 
          statusAss: "cancelado",
        },
      });
    break;
    case "invoice.paid":
      const invoice = event.data.object as Stripe.Invoice;
      
      // Verifica se existe subscription (pode ser string ou null)
      const customerId = invoice.customer as string | null;
      if (customerId) {
        try {
          const subscriptionId = invoice.lines.data[0].parent?.subscription_item_details?.subscription;  // sub_12

          // 2. Buscar detalhes da assinatura via invoice
          const priceId = invoice.lines.data[0].pricing?.price_details?.price;
          const userId = invoice.lines.data[0].metadata.userId
          const currentPeriodEnd = new Date(invoice.lines.data[0].period.end * 1000);

          // Abordagem 2: Via priceId (mais robusta - recomendado)
          const plano = (() => {
            switch(priceId) {
              case process.env.STRIPE_SUBSCRIPTION_PRICEMONTH_ID:
                return 'monthly';
              case process.env.STRIPE_SUBSCRIPTION_PRICESEMES_ID:
                return 'semiannual';
              case process.env.STRIPE_SUBSCRIPTION_PRICEANUAL_ID:
                return 'yearly';
              default:
                throw new Error("Price not found");
            }
          })()
          
        await prisma.usuario.update({
         where: { id: userId },
         data: {
           stripeCliId: customerId,
           stripeSubId: subscriptionId,
           plano,
           dtIniPremium: new Date(),
           dtFimPremium: currentPeriodEnd,
           statusAss: "ativa",
         },
       });

        } catch (error) {
          console.error("Error processing subscription:", error);
        }
      }
  break;
  case "invoice.payment_failed":
    // Falha no pagamento (atualize status para "pendente")
  break;
  }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}