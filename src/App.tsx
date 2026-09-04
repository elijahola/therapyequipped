import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { trackPageview } from './lib/analytics';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { PageLayout } from './components/layout/PageLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { About } from './pages/About';
import { Testimonials } from './pages/Testimonials';
import { NotFound } from './pages/NotFound';

/** Fires a PostHog $pageview on every SPA route change. */
const PageviewTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageview();
  }, [location.pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageviewTracker />
      <ToastProvider>
        <CartProvider>
          <PageLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageLayout>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
