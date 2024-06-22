import { Request, Response } from "express";
import PaymentModel from "../models/PaymentModel";
import { stripe } from "../config/stripeConfig";
import CartModel, { ICartItem } from "../models/CartModel";
import OrderModel from "../models/OrderModel";
import Stripe from "stripe";
import { Types } from "mongoose";
import ProductModel from "../models/ProductModel";
// import OrderModel from '../models/OrderModel';

export class PaymentController {
  // Create a new payment
  static async createPayment(req: Request, res: Response): Promise<void> {
    const { user, orderId, amount, currency, method, transactionId, details } =
      req.body;

    try {
      const payment = await PaymentModel.create({
        user,
        orderId,
        amount,
        currency,
        status: "pending", // Default status
        transactionId,
        method,
        details,
      });

      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment", error });
    }
  }

  // Update payment status
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    const { paymentId } = req.params;
    const { status } = req.body;

    try {
      const updatedPayment = await PaymentModel.findByIdAndUpdate(
        paymentId,
        { status },
        { new: true, runValidators: true }
      );

      if (!updatedPayment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      res.json(updatedPayment);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update payment status", error });
    }
  }

  // Retrieve a payment by ID
  static async getPaymentById(req: Request, res: Response): Promise<void> {
    const { paymentId } = req.params;

    try {
      const payment = await PaymentModel.findById(paymentId).populate(
        "user orderId"
      );
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve payment", error });
    }
  }

  // Retrieve all payments for a user
  static async getPaymentsByUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const payments = await PaymentModel.find({ user: userId });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve payments", error });
    }
  }

  // Handle payment confirmation from external systems (e.g., webhook)
  static async confirmPayment(req: Request, res: Response): Promise<void> {
    const { transactionId, status } = req.body;

    try {
      const payment = await PaymentModel.findOneAndUpdate(
        { transactionId },
        { status },
        { new: true }
      );

      if (!payment) {
        res
          .status(404)
          .json({ message: "Transaction not found or already updated" });
        return;
      }

      res.json({ message: "Payment confirmed successfully", payment });
    } catch (error) {
      res.status(500).json({ message: "Failed to confirm payment", error });
    }
  }

  // Additional method to handle payment cancellation or failure recovery
  static async handlePaymentFailure(
    req: Request,
    res: Response
  ): Promise<void> {
    const { paymentId } = req.params;

    try {
      const payment = await PaymentModel.findById(paymentId);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      // Implement logic based on payment method or business requirements
      if (payment.status !== "completed") {
        await PaymentModel.findByIdAndUpdate(paymentId, { status: "failed" });
        res.json({ message: "Payment marked as failed" });
      } else {
        res.status(400).json({
          message: "Payment already completed, cannot mark as failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to handle payment failure", error });
    }
  }

  // Delete a payment (if needed for admin purposes or correction)
  static async deletePayment(req: Request, res: Response): Promise<void> {
    const { paymentId } = req.params;

    try {
      const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId);
      if (!deletedPayment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      res.status(204).json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment", error });
    }
  }

  static async createCheckoutSession(
    req: Request,
    res: Response
  ): Promise<void> {
    const { cartItems } = req.body;
    const userId = req.user?._id?.toString();
    const userEmail = req.user?.email;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item: ICartItem) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
              metadata: {
                productId: item.product,
              },
            },
            unit_amount: item.price * 100, // Amount in cents
          },
          quantity: item.qty,
        })),
        mode: "payment",
        success_url: `http://localhost:3000/me/orders`,
        cancel_url: "http://localhost:3000",
        customer_email: userEmail,
        client_reference_id: userId,
        metadata: {
          userId: userId?.toString(),
          siteName: "Your Site Name",
        },
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "EG"],
        },
        payment_intent_data: {
          setup_future_usage: "on_session",
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 5,
                },
                maximum: {
                  unit: "business_day",
                  value: 7,
                },
              },
            },
          },
        ],
      });

      res.status(201).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

export async function handleStripeWebhook(
  req: Request,
  res: Response
): Promise<void> {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.userId) {
      const userId = session.metadata.userId;
      const paymentIntentId = session.payment_intent as string;
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await Promise.all(
        lineItems.data.map(async (item) => {
          const productId = item.price?.metadata.productId as string;
          const product = await ProductModel.findById(productId);
          const image =
            product && product.images.length > 0
              ? product.images[0]
              : "https://res.cloudinary.com/dhliba9i5/image/upload/v1714169979/products/default-placeholder_r9thjf.png";

          return {
            name: item.description,
            qty: item.quantity,
            image: image,
            price: item.amount_total / 100,
            product: product ? product._id : new Types.ObjectId(), // Use product ID if available, else create a placeholder
          };
        })
      );

      try {
        const order = new OrderModel({
          user: new Types.ObjectId(userId),
          orderItems,
          shippingAddress: {
            address: session.shipping_details?.address?.line1 || "",
            city: session.shipping_details?.address?.city || "",
            postalCode: session.shipping_details?.address?.postal_code || "",
            country: session.shipping_details?.address?.country || "",
          },
          paymentMethod: "card",
          paymentResult: {
            id: paymentIntentId,
            status: "succeeded",
            update_time: new Date().toISOString(),
            email_address: session.customer_details?.email || "",
          },
          taxPrice: session.total_details?.amount_tax
            ? session.total_details.amount_tax / 100
            : 0,
          shippingPrice: session.total_details?.amount_shipping
            ? session.total_details.amount_shipping / 100
            : 0,
          totalPrice: session.amount_total ? session.amount_total / 100 : 0,
          isPaid: true,
          paidAt: new Date(),
          isDelivered: false,
        });

        await order.save();

        await CartModel.findOneAndUpdate(
          { user: userId },
          {
            cartItems: [],
            itemsPrice: 0,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 0,
          }
        );

        res.status(200).json({ received: true });
      } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ message: "Failed to create order", error });
      }
    } else {
      res.status(400).json({ message: "User ID not found in metadata" });
    }
  } else {
    res.status(400).end();
  }
}
