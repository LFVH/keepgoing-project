import stripe from "@/lib/stripe";
import { logNow } from "@/utils/Logging";
import { userExists, verifyUser } from "@/utils/verifyUserAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userDB = await userExists();
  if (userDB instanceof NextResponse) return userDB;
  const userId =  userDB.id;
  const userStripeCliId = userDB.stripeCliId ?? undefined;
  const { assinatura } = await req.json();
  const precos = {
    1: process.env.STRIPE_SUBSCRIPTION_PRICEMONTH_ID,
    2: process.env.STRIPE_SUBSCRIPTION_PRICESEMES_ID,
    3: process.env.STRIPE_SUBSCRIPTION_PRICEANUAL_ID
  } as const;

  if (!([1, 2, 3] as const).includes(assinatura as any)) {    
    return new NextResponse(JSON.stringify({ error: "Assinatura inválida" }), { status: 400 });
  }

  const price = precos[assinatura as keyof typeof precos];
  if (!price) {
    return new NextResponse(JSON.stringify({ error: "Preço não configurado" }), { status: 500 });
  }
    
  try {
    const session = await stripe.checkout.sessions.create({
      customer: userStripeCliId,
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {  // <--- Isso é crucial!
        metadata: {
          userId: userId  // Repete os metadados aqui
        }
      },
      payment_method_types:  ["card"],
      success_url: `${req.headers.get("origin")}/letsgo?parabens=boratreinar`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
