export type RazorpayPlan = {
  name: string;
  price: string;
  period: string;
};

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(params: {
  plan: RazorpayPlan;
  user: any;
  profile: any;
  onSuccess: () => Promise<void>;
}) {
  const sdkReady = await loadRazorpayScript();
  if (!sdkReady || !window.Razorpay) {
    throw new Error("Razorpay could not load. Please check internet connection and try again.");
  }

  const orderResponse = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: params.plan.price,
      planName: params.plan.name,
      userEmail: params.user?.email || params.profile?.email || "",
    }),
  });

  const orderData = await orderResponse.json();
  if (!orderResponse.ok) {
    throw new Error(orderData?.error || "Unable to create payment order.");
  }

  return new Promise<void>((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Fitness Mantra",
      description: `${params.plan.name} - ${params.plan.period}`,
      order_id: orderData.order.id,
      prefill: {
        name: params.profile?.fullName || params.user?.displayName || "Fitness Mantra User",
        email: params.user?.email || params.profile?.email || "",
      },
      notes: {
        planName: params.plan.name,
        userId: params.user?.uid || "",
      },
      theme: { color: "#39FF14" },
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.verified) {
            throw new Error(verifyData?.error || "Payment verification failed.");
          }
          await params.onSuccess();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
      },
    });

    checkout.open();
  });
}
