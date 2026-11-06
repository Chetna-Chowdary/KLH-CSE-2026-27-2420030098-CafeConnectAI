import React, { useState } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LoginModal } from './components/LoginModal';

import { LandingPage } from './pages/LandingPage';
import { ExploreMenuPage } from './pages/ExploreMenuPage';
import { CategoryMenuPage } from './pages/CategoryMenuPage';
import { PackagedSnacksPage } from './pages/PackagedSnacksPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { KitchenLoginPage } from './pages/KitchenLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { InventoryManagementPage } from './pages/InventoryManagementPage';
import { MenuManagementPage } from './pages/MenuManagementPage';
import { KitchenStationManagementPage } from './pages/KitchenStationManagementPage';
import { AlertsCenterPage } from './pages/AlertsCenterPage';
import { DetailedAnalyticsPage } from './pages/DetailedAnalyticsPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';

import { MenuItem, Order } from './types';

const MainApp: React.FC = () => {
  const { currentUser } = useCafe();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [categoryParam, setCategoryParam] = useState<string>('south_indian');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, param?: string) => {
    if (param) {
      setCategoryParam(param);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProduct(item);
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setTrackedOrderId(order.id);
    setCurrentTab('confirmation');
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackedOrderId(orderId);
    setCurrentTab('tracking');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0284C7] selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'menu' && (
          <ExploreMenuPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            initialCategory="all"
          />
        )}

        {currentTab === 'category' && (
          <CategoryMenuPage
            categoryId={categoryParam}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'packaged_snacks' && (
          <PackagedSnacksPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'cart' && (
          <CartPage
            onNavigate={handleNavigate}
            onProceedCheckout={() => setCurrentTab('checkout')}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => setCurrentTab('cart')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentTab === 'confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            onTrackOrder={handleTrackOrder}
            onContinueBrowsing={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'tracking' && (
          <OrderTrackingPage
            orderId={trackedOrderId}
            onNavigate={handleNavigate}
          />
        )}

        {/* Kitchen Portal: shows KitchenLoginPage if not authenticated as kitchen or admin */}
        {currentTab === 'kitchen_login' && (
          <KitchenLoginPage
            onLoginSuccess={() => setCurrentTab('kitchen')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'kitchen' && (
          currentUser.role === 'kitchen' || currentUser.role === 'admin' ? (
            <KitchenDashboard
              onNavigate={handleNavigate}
            />
          ) : (
            <KitchenLoginPage
              onLoginSuccess={() => setCurrentTab('kitchen')}
              onNavigate={handleNavigate}
            />
          )
        )}

        {/* Admin Portal: shows AdminLoginPage if not authenticated as admin */}
        {currentTab === 'admin_login' && (
          <AdminLoginPage
            onLoginSuccess={() => setCurrentTab('admin')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin' && (
          currentUser.role === 'admin' ? (
            <AdminDashboard
              onNavigate={handleNavigate}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => setCurrentTab('admin')}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentTab === 'inventory' && (
          currentUser.role === 'admin' ? (
            <InventoryManagementPage />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => setCurrentTab('inventory')}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentTab === 'menu_mgmt' && (
          currentUser.role === 'admin' ? (
            <MenuManagementPage />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => setCurrentTab('menu_mgmt')}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentTab === 'stations' && (
          currentUser.role === 'admin' || currentUser.role === 'kitchen' ? (
            <KitchenStationManagementPage />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => setCurrentTab('stations')}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentTab === 'alerts' && (
          <AlertsCenterPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'analytics' && (
          currentUser.role === 'admin' ? (
            <DetailedAnalyticsPage />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => setCurrentTab('analytics')}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentTab === 'history' && (
          <OrderHistoryPage
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackOrder}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCart={() => {
          setSelectedProduct(null);
          setCurrentTab('cart');
        }}
      />

      {/* Login & Persona Switcher Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccessNavigate={(tab) => setCurrentTab(tab)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export function App() {
  return (
    <CafeProvider>
      <MainApp />
    </CafeProvider>
  );
}

export default App;
