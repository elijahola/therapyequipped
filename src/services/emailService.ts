import type { CartItem } from '../types/index.js';
import { getProductById } from '../data/products';
import { formatCurrency } from '../utils/formatting';

interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const sendOrderNotification = async (orderDetails: OrderDetails): Promise<boolean> => {
  try {
    // Get API URL from environment (defaults to local dev server)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // Prepare order data with product names and formatted prices
    const itemsWithDetails = orderDetails.items.map((item) => {
      const product = getProductById(item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        price: formatCurrency(product ? product.price * item.quantity : 0),
      };
    });

    const emailData = {
      orderDetails: {
        items: itemsWithDetails,
        subtotal: formatCurrency(orderDetails.subtotal),
        shipping: orderDetails.shipping === 0 ? 'FREE' : formatCurrency(orderDetails.shipping),
        total: formatCurrency(orderDetails.total),
        customerInfo: orderDetails.customerInfo,
      },
    };

    console.log('📧 Sending order notification to API...');

    // Send to API endpoint
    const response = await fetch(`${apiUrl}/api/send-order-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('✅ Order notification sent successfully:', result);

    return true;
  } catch (error) {
    console.error('❌ Failed to send order notification:', error);
    console.error('Make sure the API server is running: npm run server');
    // Don't fail the order if email fails
    return false;
  }
};

export const sendCustomerReceipt = async (orderDetails: OrderDetails): Promise<boolean> => {
  try {
    // Get API URL from environment (defaults to local dev server)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // Prepare order data with product names and formatted prices
    const itemsWithDetails = orderDetails.items.map((item) => {
      const product = getProductById(item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        price: formatCurrency(product ? product.price * item.quantity : 0),
      };
    });

    const emailData = {
      orderDetails: {
        items: itemsWithDetails,
        subtotal: formatCurrency(orderDetails.subtotal),
        shipping: orderDetails.shipping === 0 ? 'FREE' : formatCurrency(orderDetails.shipping),
        total: formatCurrency(orderDetails.total),
        customerInfo: orderDetails.customerInfo,
      },
    };

    console.log('📧 Sending customer receipt email...');

    // Send to API endpoint
    const response = await fetch(`${apiUrl}/api/send-customer-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send customer receipt');
    }

    const result = await response.json();
    console.log('✅ Customer receipt sent successfully:', result);

    return true;
  } catch (error) {
    console.error('❌ Failed to send customer receipt:', error);
    console.error('Make sure the API server is running: npm run server');
    // Don't fail the order if email fails
    return false;
  }
};
