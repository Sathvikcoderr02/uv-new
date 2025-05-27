import {
  users, type User, type InsertUser,
  otpCodes, type OtpCode, type InsertOtpCode,
  subscriptionPlans, type SubscriptionPlan, type InsertSubscriptionPlan,
  vendors, type Vendor, type InsertVendor,
  domains, type Domain, type InsertDomain,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  productVariants, type ProductVariant, type InsertProductVariant,
  customers, type Customer, type InsertCustomer,
  customerAddresses, type CustomerAddress, type InsertCustomerAddress,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  analytics, type Analytics, type InsertAnalytics,
  paymentMethods, type PaymentMethod, type InsertPaymentMethod,
  platformSubscriptions, type PlatformSubscription, type InsertPlatformSubscription,
  invoices, type Invoice, type InsertInvoice,
  transactions, type Transaction, type InsertTransaction,
  payouts, type Payout, type InsertPayout,
  customerPaymentMethods, type CustomerPaymentMethod, type InsertCustomerPaymentMethod,
  paymentProviderSettings, type PaymentProviderSettings, type InsertPaymentProviderSettings,
  carts, cartItems
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or } from "drizzle-orm";
import Decimal from "decimal.js";
import session from "express-session";
import createMemoryStore from "memorystore";

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: Partial<InsertUser>): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Cart operations
  getCartByUserId(userId: number): Promise<any>;
  getCartBySessionId(sessionId: string): Promise<any>;
  addToCart(userId: number | null, sessionId: string | null, item: any): Promise<any>;
  updateCartItemQuantity(userId: number | null, sessionId: string | null, itemId: number, quantity: number): Promise<any>;
  removeFromCart(userId: number | null, sessionId: string | null, itemId: number): Promise<any>;
  clearCart(userId: number | null, sessionId: string | null): Promise<boolean>;
  
  // OTP operations
  createOtp(email: string, code: string, expiresAt: Date): Promise<OtpCode>;
  getLatestOtp(email: string): Promise<OtpCode | undefined>;
  markOtpAsUsed(id: number): Promise<OtpCode | undefined>;

  // Subscription plan operations
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  
  // Vendor subscription operations
  getVendorSubscription(vendorId: number): Promise<SubscriptionInfo | undefined>;
  createVendorSubscription(subscription: InsertPlatformSubscription): Promise<SubscriptionInfo>;
  updateVendorSubscription(id: number, data: Partial<InsertPlatformSubscription>): Promise<SubscriptionInfo | undefined>;
  getVendorIdByUserId(userId: number): Promise<number | undefined>;

  // Vendor operations
  getVendor(id: number): Promise<Vendor | undefined>;
  getVendors(): Promise<Vendor[]>;
  getVendorByUserId(userId: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, data: Partial<InsertVendor>): Promise<Vendor | undefined>;

  // Domain operations
  getDomain(id: number): Promise<Domain | undefined>;
  getDomains(): Promise<Domain[]>;
  getDomainsByVendorId(vendorId: number): Promise<Domain[]>;
  getDomainByName(name: string): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: number, data: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: number): Promise<boolean>;
  verifyDomain(id: number): Promise<Domain | undefined>;
  generateVerificationToken(id: number): Promise<Domain | undefined>;
  checkDomainsSSL(): Promise<void>;

  // Product category operations
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  getProductCategories(vendorId: number): Promise<ProductCategory[]>;
  getGlobalProductCategories(): Promise<ProductCategory[]>;
  getAllProductCategories(): Promise<ProductCategory[]>; // Get both global and vendor-specific categories
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  updateProductCategory(id: number, data: Partial<InsertProductCategory>): Promise<ProductCategory | undefined>;
  deleteProductCategory(id: number): Promise<boolean>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(vendorId: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Product variant operations
  getProductVariant(id: number): Promise<ProductVariant | undefined>;
  getProductVariantsByProductId(productId: number): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: number, data: Partial<InsertProductVariant>): Promise<ProductVariant | undefined>;
  deleteProductVariant(id: number): Promise<boolean>;

  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomers(vendorId: number): Promise<Customer[]>;
  getCustomerByEmail(email: string, vendorId: number): Promise<Customer | undefined>;
  getCustomerByUserId(userId: number, vendorId: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer | undefined>;

  // Customer address operations
  getCustomerAddress(id: number): Promise<CustomerAddress | undefined>;
  getCustomerAddresses(customerId: number): Promise<CustomerAddress[]>;
  createCustomerAddress(address: InsertCustomerAddress): Promise<CustomerAddress>;
  updateCustomerAddress(id: number, data: Partial<InsertCustomerAddress>): Promise<CustomerAddress | undefined>;
  deleteCustomerAddress(id: number): Promise<boolean>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(vendorId: number): Promise<Order[]>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order | undefined>;

  // Order item operations
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  updateOrderItem(id: number, data: Partial<InsertOrderItem>): Promise<OrderItem | undefined>;
  deleteOrderItem(id: number): Promise<boolean>;

  // Analytics operations
  getVendorAnalytics(vendorId: number): Promise<Analytics[]>;
  createAnalyticsEntry(data: InsertAnalytics): Promise<Analytics>;
  getTopProducts(vendorId: number, limit?: number): Promise<{ name: string, sales: number, revenue: string }[]>;
  getSalesByHour(vendorId: number): Promise<{ hour: string, sales: number }[]>;
  getSalesByCategory(vendorId: number): Promise<{ name: string, value: number, amount: string }[]>;
  
  // Platform statistics
  getPlatformStats(): Promise<{
    totalVendors: number;
    activeDomains: number;
    totalRevenue: number;
    pendingIssues: number;
  }>;

  // Payment methods operations
  getPaymentMethod(id: number): Promise<PaymentMethod | undefined>;
  getPaymentMethodsByVendorId(vendorId: number): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, data: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: number): Promise<boolean>;
  setDefaultPaymentMethod(id: number, vendorId: number): Promise<PaymentMethod | undefined>;

  // Platform subscription operations
  getPlatformSubscription(id: number): Promise<PlatformSubscription | undefined>;
  getPlatformSubscriptionByVendorId(vendorId: number): Promise<PlatformSubscription | undefined>;
  createPlatformSubscription(subscription: InsertPlatformSubscription): Promise<PlatformSubscription>;
  updatePlatformSubscription(id: number, data: Partial<InsertPlatformSubscription>): Promise<PlatformSubscription | undefined>;
  cancelPlatformSubscription(id: number, reason: string): Promise<PlatformSubscription | undefined>;

  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  getInvoicesByVendorId(vendorId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  markInvoiceAsPaid(id: number): Promise<Invoice | undefined>;

  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByVendorId(vendorId: number): Promise<Transaction[]>;
  getTransactionsByOrderId(orderId: number): Promise<Transaction[]>;
  getTransactionsByInvoiceId(invoiceId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, data: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  processRefund(transactionId: number, amount: string, reason: string): Promise<Transaction | undefined>;

  // Payout operations
  getPayout(id: number): Promise<Payout | undefined>;
  getPayoutsByVendorId(vendorId: number): Promise<Payout[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: number, data: Partial<InsertPayout>): Promise<Payout | undefined>;
  completePayout(id: number): Promise<Payout | undefined>;

  // Customer payment methods operations
  getCustomerPaymentMethod(id: number): Promise<CustomerPaymentMethod | undefined>;
  getCustomerPaymentMethodsByCustomerId(customerId: number): Promise<CustomerPaymentMethod[]>;
  createCustomerPaymentMethod(method: InsertCustomerPaymentMethod): Promise<CustomerPaymentMethod>;
  updateCustomerPaymentMethod(id: number, data: Partial<InsertCustomerPaymentMethod>): Promise<CustomerPaymentMethod | undefined>;
  deleteCustomerPaymentMethod(id: number): Promise<boolean>;
  setDefaultCustomerPaymentMethod(id: number, customerId: number): Promise<CustomerPaymentMethod | undefined>;

  // Payment provider settings operations
  getPaymentProviderSettings(id: number): Promise<PaymentProviderSettings | undefined>;
  getPaymentProviderSettingsByVendorId(vendorId: number, provider: string): Promise<PaymentProviderSettings | undefined>;
  createPaymentProviderSettings(settings: InsertPaymentProviderSettings): Promise<PaymentProviderSettings>;
  updatePaymentProviderSettings(id: number, data: Partial<InsertPaymentProviderSettings>): Promise<PaymentProviderSettings | undefined>;
  togglePaymentProviderActive(id: number, isActive: boolean): Promise<PaymentProviderSettings | undefined>;
}

export class MemStorage implements IStorage {
  public sessionStore: session.Store;
  private users: Map<number, User>;
  private otpCodes: Map<number, OtpCode>;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private vendors: Map<number, Vendor>;
  private domains: Map<number, Domain>;
  private productCategories: Map<number, ProductCategory>;
  private products: Map<number, Product>;
  private productVariants: Map<number, ProductVariant>;
  private customers: Map<number, Customer>;
  private customerAddresses: Map<number, CustomerAddress>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private analytics: Map<number, Analytics>;
  private paymentMethods: Map<number, PaymentMethod>;
  private platformSubscriptions: Map<number, PlatformSubscription>;
  private invoices: Map<number, Invoice>;
  private transactions: Map<number, Transaction>;
  private payouts: Map<number, Payout>;
  private customerPaymentMethods: Map<number, CustomerPaymentMethod>;
  private paymentProviderSettings: Map<number, PaymentProviderSettings>;
  private carts: Map<number, any>; // User ID -> Cart

  private userId: number = 1;
  private otpId: number = 1;
  private subscriptionPlanId: number = 1;
  private vendorId: number = 1;
  private domainId: number = 1;
  private productCategoryId: number = 1;
  private productId: number = 1;
  private productVariantId: number = 1;
  private customerId: number = 1;
  private customerAddressId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;
  private analyticsId: number = 1;
  private paymentMethodId: number = 1;
  private platformSubscriptionId: number = 1;
  private invoiceId: number = 1;
  private transactionId: number = 1;
  private payoutId: number = 1;
  private customerPaymentMethodId: number = 1;
  private paymentProviderSettingsId: number = 1;

  constructor() {
    // Initialize in-memory session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    this.users = new Map();
    this.otpCodes = new Map();
    this.subscriptionPlans = new Map();
    this.vendors = new Map();
    this.domains = new Map();
    this.productCategories = new Map();
    this.products = new Map();
    this.productVariants = new Map();
    this.customers = new Map();
    this.customerAddresses = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.analytics = new Map();
    this.paymentMethods = new Map();
    this.platformSubscriptions = new Map();
    this.invoices = new Map();
    this.transactions = new Map();
    this.payouts = new Map();
    this.customerPaymentMethods = new Map();
    this.paymentProviderSettings = new Map();
    this.carts = new Map();

    // Initialize with default subscription plans
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default subscription plans based on the design
    const basicPlan: InsertSubscriptionPlan = {
      name: "Basic",
      description: "Perfect for small businesses just getting started with e-commerce",
      price: "2999",
      yearlyPrice: "29990",
      features: ["Up to 50 products", "5GB storage", "1 custom domain", "Email support"],
      productLimit: 50,
      storageLimit: 5000,
      customDomainLimit: 1,
      supportLevel: "basic",
      isActive: true,
      trialDays: 7,
      isDefault: false,
      currency: "INR"
    };
    
    const proPlan: InsertSubscriptionPlan = {
      name: "Pro",
      description: "For growing businesses with expanded inventory needs",
      price: "7999",
      yearlyPrice: "79990",
      features: ["Up to 500 products", "20GB storage", "3 custom domains", "Priority support", "Advanced analytics", "Automated inventory alerts"],
      productLimit: 500,
      storageLimit: 20000,
      customDomainLimit: 3,
      supportLevel: "priority",
      isActive: true,
      trialDays: 7,
      isDefault: true,
      currency: "INR"
    };
    
    const businessPlan: InsertSubscriptionPlan = {
      name: "Business",
      description: "Enterprise-grade solution for established online retailers",
      price: "14999",
      yearlyPrice: "149990",
      features: ["Unlimited products", "100GB storage", "10 custom domains", "Premium support", "Advanced analytics", "API access", "Dedicated account manager"],
      productLimit: 10000,
      storageLimit: 100000,
      customDomainLimit: 10,
      supportLevel: "premium",
      isActive: true,
      trialDays: 7,
      isDefault: false,
      currency: "INR"
    };
    
    this.createSubscriptionPlan(basicPlan);
    this.createSubscriptionPlan(proPlan);
    this.createSubscriptionPlan(businessPlan);
    
    // Create super admin user
    const adminUser: Partial<InsertUser> = {
      email: "admin@multivend.com",
      firstName: "Super",
      lastName: "Admin",
      role: "super_admin",
      isProfileComplete: true,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    };
    
    this.createUser(adminUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...userData, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // OTP operations
  async createOtp(email: string, code: string, expiresAt: Date): Promise<OtpCode> {
    const id = this.otpId++;
    const otpCode: OtpCode = {
      id,
      email,
      code,
      expiresAt,
      isUsed: false,
      createdAt: new Date()
    };
    this.otpCodes.set(id, otpCode);
    return otpCode;
  }

  async getLatestOtp(email: string): Promise<OtpCode | undefined> {
    const userOtps = Array.from(this.otpCodes.values())
      .filter(otp => otp.email === email && !otp.isUsed && otp.expiresAt > new Date());
    
    if (userOtps.length === 0) return undefined;
    
    // Find the most recent OTP
    return userOtps.reduce((latest, current) => 
      latest.createdAt > current.createdAt ? latest : current
    );
  }

  async markOtpAsUsed(id: number): Promise<OtpCode | undefined> {
    const otp = this.otpCodes.get(id);
    if (!otp) return undefined;
    
    const updatedOtp = { ...otp, isUsed: true };
    this.otpCodes.set(id, updatedOtp);
    return updatedOtp;
  }

  // Subscription plan operations
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }

  async createSubscriptionPlan(planData: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.subscriptionPlanId++;
    const plan: SubscriptionPlan = { ...planData, id, createdAt: new Date() };
    this.subscriptionPlans.set(id, plan);
    return plan;
  }

  async updateSubscriptionPlan(id: number, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const plan = await this.getSubscriptionPlan(id);
    if (!plan) return undefined;
    
    // If setting this plan as default, unset default on all other plans
    if (data.isDefault) {
      // Get all plans
      const plans = await this.getSubscriptionPlans();
      // Update other default plans to not be default
      for (const otherPlan of plans) {
        if (otherPlan.id !== id && otherPlan.isDefault) {
          const updatedOtherPlan = { ...otherPlan, isDefault: false };
          this.subscriptionPlans.set(otherPlan.id, updatedOtherPlan);
        }
      }
    }
    
    const updatedPlan = { ...plan, ...data };
    this.subscriptionPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    // Check if plan exists
    const plan = await this.getSubscriptionPlan(id);
    if (!plan) return false;
    
    // Check if any vendors are using this plan
    for (const vendor of this.vendors.values()) {
      if (vendor.subscriptionPlanId === id) {
        // Plan is in use, cannot delete
        return false;
      }
    }
    
    // Delete the plan
    this.subscriptionPlans.delete(id);
    return true;
  }

  async getVendorIdByUserId(userId: number): Promise<number | undefined> {
    for (const vendor of this.vendors.values()) {
      if (vendor.userId === userId) {
        return vendor.id;
      }
    }
    return undefined;
  }

  async getVendorSubscription(vendorId: number): Promise<SubscriptionInfo | undefined> {
    // Find the subscription for this vendor
    for (const subscription of this.platformSubscriptions.values()) {
      if (subscription.vendorId === vendorId) {
        // Get the associated plan
        const plan = await this.getSubscriptionPlan(subscription.planId);
        if (!plan) {
          return undefined;
        }
        
        // Return the combined subscription info
        return {
          ...subscription,
          plan
        };
      }
    }
    return undefined;
  }

  async createVendorSubscription(subscriptionData: InsertPlatformSubscription): Promise<SubscriptionInfo> {
    // Create the subscription
    const id = this.platformSubscriptionId++;
    const subscription: PlatformSubscription = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...subscriptionData
    };
    
    this.platformSubscriptions.set(id, subscription);
    
    // Get the associated plan
    const plan = await this.getSubscriptionPlan(subscription.planId);
    if (!plan) {
      throw new Error(`Subscription plan with ID ${subscription.planId} not found`);
    }
    
    // Return the combined subscription info
    return {
      ...subscription,
      plan
    };
  }

  async updateVendorSubscription(
    id: number,
    data: Partial<InsertPlatformSubscription>
  ): Promise<SubscriptionInfo | undefined> {
    const subscription = this.platformSubscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = {
      ...subscription,
      ...data,
      updatedAt: new Date()
    };
    
    this.platformSubscriptions.set(id, updatedSubscription);
    
    // Get the associated plan
    const plan = await this.getSubscriptionPlan(updatedSubscription.planId);
    if (!plan) {
      throw new Error(`Subscription plan with ID ${updatedSubscription.planId} not found`);
    }
    
    // Return the combined subscription info
    return {
      ...updatedSubscription,
      plan
    };
  }

  // Vendor operations
  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendorByUserId(userId: number): Promise<Vendor | undefined> {
    return Array.from(this.vendors.values()).find(vendor => vendor.userId === userId);
  }

  async createVendor(vendorData: InsertVendor): Promise<Vendor> {
    const id = this.vendorId++;
    const vendor: Vendor = { 
      ...vendorData, 
      id, 
      createdAt: new Date(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: number, data: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const vendor = await this.getVendor(id);
    if (!vendor) return undefined;
    
    const updatedVendor = { ...vendor, ...data };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  // Domain operations
  async getDomain(id: number): Promise<Domain | undefined> {
    return this.domains.get(id);
  }

  async getDomains(): Promise<Domain[]> {
    return Array.from(this.domains.values());
  }

  async getDomainsByVendorId(vendorId: number): Promise<Domain[]> {
    return Array.from(this.domains.values()).filter(domain => domain.vendorId === vendorId);
  }

  async getDomainByName(name: string): Promise<Domain | undefined> {
    return Array.from(this.domains.values()).find(domain => domain.name === name);
  }

  async createDomain(domainData: InsertDomain): Promise<Domain> {
    const id = this.domainId++;
    
    // Generate a verification token if it's a custom domain
    let verificationToken = null;
    let dnsRecords = [];
    
    if (domainData.type === "custom") {
      // Generate a random verification token for domain ownership verification
      verificationToken = `multivend-verify-${Math.random().toString(36).substring(2, 15)}`;
      
      // Create DNS record instructions based on domain name
      const domainName = domainData.name;
      dnsRecords = [
        { type: "TXT", name: `_multivend-verification.${domainName}`, value: verificationToken },
        { type: "CNAME", name: domainName, value: "stores.multivend.com" },
        { type: "CNAME", name: `www.${domainName}`, value: "stores.multivend.com" }
      ];
    }
    
    const domain: Domain = { 
      ...domainData, 
      id, 
      verificationToken,
      dnsRecords: dnsRecords.length > 0 ? dnsRecords : undefined,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year expiration
    };
    
    this.domains.set(id, domain);
    return domain;
  }

  async updateDomain(id: number, data: Partial<InsertDomain>): Promise<Domain | undefined> {
    const domain = await this.getDomain(id);
    if (!domain) return undefined;
    
    const updatedDomain = { ...domain, ...data };
    
    // If changing from subdomain to custom domain, generate verification token and DNS records
    if (domain.type !== "custom" && data.type === "custom" && !domain.verificationToken) {
      const verificationToken = `multivend-verify-${Math.random().toString(36).substring(2, 15)}`;
      const domainName = data.name || domain.name;
      
      const dnsRecords = [
        { type: "TXT", name: `_multivend-verification.${domainName}`, value: verificationToken },
        { type: "CNAME", name: domainName, value: "stores.multivend.com" },
        { type: "CNAME", name: `www.${domainName}`, value: "stores.multivend.com" }
      ];
      
      updatedDomain.verificationToken = verificationToken;
      updatedDomain.dnsRecords = dnsRecords;
      updatedDomain.verificationStatus = "pending";
    }
    
    this.domains.set(id, updatedDomain);
    return updatedDomain;
  }

  async verifyDomain(id: number): Promise<Domain | undefined> {
    const domain = await this.getDomain(id);
    if (!domain) return undefined;
    
    // In a real implementation, this would check DNS records
    // For this prototype, we'll just simulate verification
    
    domain.verificationStatus = "verified";
    domain.status = "active";
    domain.lastCheckedAt = new Date();
    
    this.domains.set(id, domain);
    return domain;
  }
  
  async generateVerificationToken(id: number): Promise<Domain | undefined> {
    const domain = await this.getDomain(id);
    if (!domain) return undefined;
    
    // Generate a random verification token
    const token = `multivend-verify-${Math.random().toString(36).substring(2, 15)}`;
    
    domain.verificationToken = token;
    domain.verificationStatus = "pending";
    domain.lastCheckedAt = new Date();
    
    this.domains.set(id, domain);
    return domain;
  }
  
  async checkDomainsSSL(): Promise<void> {
    // In a real implementation, this would check SSL certificates
    // For this prototype, we'll simulate SSL status updates for active domains
    
    const domains = await this.getDomains();
    
    for (const domain of domains) {
      if (domain.status === "active" && domain.verificationStatus === "verified") {
        domain.sslStatus = "valid";
        domain.lastCheckedAt = new Date();
        this.domains.set(domain.id, domain);
      }
    }
  }

  async deleteDomain(id: number): Promise<boolean> {
    return this.domains.delete(id);
  }

  // Product category operations
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    return this.productCategories.get(id);
  }

  async getProductCategories(vendorId: number): Promise<ProductCategory[]> {
    // Return vendor-specific categories plus global categories
    return Array.from(this.productCategories.values()).filter(category => 
      category.vendorId === vendorId || (category.isGlobal === true)
    );
  }
  
  async getGlobalProductCategories(): Promise<ProductCategory[]> {
    // Return only global categories (created by super admin)
    return Array.from(this.productCategories.values()).filter(category => 
      category.isGlobal === true
    );
  }
  
  async getAllProductCategories(): Promise<ProductCategory[]> {
    // Return all categories (for super admin)
    return Array.from(this.productCategories.values());
  }

  async createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory> {
    const id = this.productCategoryId++;
    const category: ProductCategory = { ...categoryData, id, createdAt: new Date() };
    this.productCategories.set(id, category);
    return category;
  }

  async updateProductCategory(id: number, data: Partial<InsertProductCategory>): Promise<ProductCategory | undefined> {
    const category = await this.getProductCategory(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...data };
    this.productCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteProductCategory(id: number): Promise<boolean> {
    return this.productCategories.delete(id);
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(vendorId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.vendorId === vendorId);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const product: Product = { 
      ...productData, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...data, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Product variant operations
  async getProductVariant(id: number): Promise<ProductVariant | undefined> {
    return this.productVariants.get(id);
  }

  async getProductVariantsByProductId(productId: number): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values())
      .filter(variant => variant.productId === productId);
  }

  async createProductVariant(variantData: InsertProductVariant): Promise<ProductVariant> {
    const id = this.productVariantId++;
    const variant: ProductVariant = { ...variantData, id, createdAt: new Date() };
    this.productVariants.set(id, variant);
    return variant;
  }

  async updateProductVariant(id: number, data: Partial<InsertProductVariant>): Promise<ProductVariant | undefined> {
    const variant = await this.getProductVariant(id);
    if (!variant) return undefined;
    
    const updatedVariant = { ...variant, ...data };
    this.productVariants.set(id, updatedVariant);
    return updatedVariant;
  }

  async deleteProductVariant(id: number): Promise<boolean> {
    return this.productVariants.delete(id);
  }

  // Cart operations
  async getCartByUserId(userId: number): Promise<any> {
    try {
      // First check if there's a cart in memory
      let cart = this.carts.get(userId);
      if (cart) return cart;
      
      // Otherwise, try to get from database
      try {
        // Check if user has an existing cart
        const [existingCart] = await db
          .select()
          .from(carts)
          .where(eq(carts.userId, userId))
          .limit(1);
        
        if (existingCart) {
          // Get cart items
          const items = await db
            .select()
            .from(cartItems)
            .where(eq(cartItems.cartId, existingCart.id));
          
          // Create cart object
          cart = {
            ...existingCart,
            items: items || []
          };
          
          // Cache it
          this.carts.set(userId, cart);
          return cart;
        }
      } catch (error) {
        console.error("Error getting cart from database:", error);
      }
      
      // Return default cart if nothing found
      return {
        id: 0,
        userId,
        items: [],
        subtotal: "0.00",
        tax: "0.00",
        total: "0.00",
        vendorId: 1
      };
    } catch (error) {
      console.error("Error in getCartByUserId:", error);
      return {
        id: 0,
        userId,
        items: [],
        subtotal: "0.00",
        tax: "0.00",
        total: "0.00",
        vendorId: 1
      };
    }
  }
  
  async getCartBySessionId(sessionId: string): Promise<any> {
    try {
      // Try to get from database
      try {
        // Check if session has an existing cart
        const [existingCart] = await db
          .select()
          .from(carts)
          .where(eq(carts.sessionId, sessionId))
          .limit(1);
        
        if (existingCart) {
          // Get cart items
          const items = await db
            .select()
            .from(cartItems)
            .where(eq(cartItems.cartId, existingCart.id));
          
          // Return cart with items
          return {
            ...existingCart,
            items: items || []
          };
        }
      } catch (error) {
        console.error("Error getting cart from database:", error);
      }
      
      // Return default cart if nothing found
      return {
        id: 0,
        sessionId,
        items: [],
        subtotal: "0.00",
        tax: "0.00",
        total: "0.00",
        vendorId: 1
      };
    } catch (error) {
      console.error("Error in getCartBySessionId:", error);
      return {
        id: 0,
        sessionId,
        items: [],
        subtotal: "0.00",
        tax: "0.00",
        total: "0.00",
        vendorId: 1
      };
    }
  }

  async addToCart(userId: number | null, sessionId: string | null, item: any): Promise<any> {
    try {
      let cart;
      
      // Get appropriate cart based on authentication status
      if (userId) {
        cart = await this.getCartByUserId(userId);
      } else if (sessionId) {
        cart = await this.getCartBySessionId(sessionId);
      } else {
        throw new Error("Either userId or sessionId is required");
      }
      
      // Create cart in database if it doesn't exist
      if (!cart.id || cart.id === 0) {
        try {
          const [newCart] = await db
            .insert(carts)
            .values({
              userId: userId || null,
              sessionId: sessionId || null,
              vendorId: item.vendorId || 1,
              subtotal: "0.00",
              tax: "0.00",
              total: "0.00",
            })
            .returning();
            
          cart = { ...newCart, items: [] };
        } catch (error) {
          console.error("Error creating cart:", error);
          // Continue with in-memory cart if database operation fails
        }
      }
      
      // Get product details
      const product = await this.getProduct(item.productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Check for existing item
      const existingItem = cart.items.find((i: any) => i.productId === item.productId);
      
      if (existingItem) {
        // Update quantity if item exists
        try {
          await db
            .update(cartItems)
            .set({ quantity: existingItem.quantity + item.quantity })
            .where(eq(cartItems.id, existingItem.id));
            
          existingItem.quantity += item.quantity;
        } catch (error) {
          console.error("Error updating cart item:", error);
          // Update in-memory if database operation fails
          existingItem.quantity += item.quantity;
        }
      } else {
        // Add new item
        try {
          const [newItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productId: product.id,
              name: product.name,
              price: product.sellingPrice.toString(),
              quantity: item.quantity,
              imageUrl: product.featuredImageUrl || null,
              variant: item.variant || null,
            })
            .returning();
            
          cart.items.push(newItem);
        } catch (error) {
          console.error("Error adding cart item:", error);
          // Add to in-memory if database operation fails
          const tempItem = {
            id: Math.floor(Math.random() * 10000),
            cartId: cart.id,
            productId: product.id,
            name: product.name,
            price: product.sellingPrice.toString(),
            quantity: item.quantity,
            imageUrl: product.featuredImageUrl || null,
            variant: item.variant || null,
            createdAt: new Date()
          };
          
          cart.items.push(tempItem);
        }
      }
      
      // Recalculate cart totals
      await this.recalculateCartTotals(cart);
      
      // Sync with in-memory storage
      if (userId) {
        this.carts.set(userId, cart);
      }
      
      return cart;
    } catch (error) {
      console.error("Error in addToCart:", error);
      throw error;
    }
  }

  async updateCartItemQuantity(userId: number | null, sessionId: string | null, itemId: number, quantity: number): Promise<any> {
    try {
      let cart;
      
      // Get appropriate cart based on authentication status
      if (userId) {
        cart = await this.getCartByUserId(userId);
      } else if (sessionId) {
        cart = await this.getCartBySessionId(sessionId);
      } else {
        throw new Error("Either userId or sessionId is required");
      }
      
      // Find the item
      const item = cart.items.find((i: any) => i.id === itemId);
      if (!item) {
        throw new Error("Cart item not found");
      }
      
      // Update quantity
      try {
        await db
          .update(cartItems)
          .set({ quantity })
          .where(eq(cartItems.id, itemId));
          
        item.quantity = quantity;
      } catch (error) {
        console.error("Error updating cart item quantity:", error);
        // Update in-memory if database operation fails
        item.quantity = quantity;
      }
      
      // Recalculate cart totals
      await this.recalculateCartTotals(cart);
      
      // Sync with in-memory storage
      if (userId) {
        this.carts.set(userId, cart);
      }
      
      return cart;
    } catch (error) {
      console.error("Error in updateCartItemQuantity:", error);
      throw error;
    }
  }

  async removeFromCart(userId: number | null, sessionId: string | null, itemId: number): Promise<any> {
    try {
      let cart;
      
      // Get appropriate cart based on authentication status
      if (userId) {
        cart = await this.getCartByUserId(userId);
      } else if (sessionId) {
        cart = await this.getCartBySessionId(sessionId);
      } else {
        throw new Error("Either userId or sessionId is required");
      }
      
      // Find the item
      const itemIndex = cart.items.findIndex((i: any) => i.id === itemId);
      if (itemIndex === -1) {
        throw new Error("Cart item not found");
      }
      
      // Remove from database
      try {
        await db
          .delete(cartItems)
          .where(eq(cartItems.id, itemId));
      } catch (error) {
        console.error("Error removing cart item from database:", error);
      }
      
      // Remove from in-memory cart
      cart.items.splice(itemIndex, 1);
      
      // Recalculate cart totals
      await this.recalculateCartTotals(cart);
      
      // Sync with in-memory storage
      if (userId) {
        this.carts.set(userId, cart);
      }
      
      return cart;
    } catch (error) {
      console.error("Error in removeFromCart:", error);
      throw error;
    }
  }

  async clearCart(userId: number | null, sessionId: string | null): Promise<boolean> {
    try {
      let cart;
      
      // Get appropriate cart based on authentication status
      if (userId) {
        cart = await this.getCartByUserId(userId);
      } else if (sessionId) {
        cart = await this.getCartBySessionId(sessionId);
      } else {
        throw new Error("Either userId or sessionId is required");
      }
      
      if (!cart || !cart.id || cart.id === 0) {
        return true; // Cart is already empty
      }
      
      // Delete all items from database
      try {
        await db
          .delete(cartItems)
          .where(eq(cartItems.cartId, cart.id));
          
        // Reset cart totals
        await db
          .update(carts)
          .set({
            subtotal: "0.00",
            tax: "0.00",
            total: "0.00",
          })
          .where(eq(carts.id, cart.id));
      } catch (error) {
        console.error("Error clearing cart from database:", error);
      }
      
      // Clear in-memory cart
      const emptyCart = {
        ...cart,
        items: [],
        subtotal: "0.00",
        tax: "0.00",
        total: "0.00",
      };
      
      // Sync with in-memory storage
      if (userId) {
        this.carts.set(userId, emptyCart);
      }
      
      return true;
    } catch (error) {
      console.error("Error in clearCart:", error);
      return false;
    }
  }
  
  // Helper method to recalculate cart totals
  private async recalculateCartTotals(cart: any): Promise<void> {
    try {
      if (!cart || !cart.id || cart.id === 0) return;
      
      // Calculate subtotal
      let subtotal = new Decimal(0);
      for (const item of cart.items) {
        const price = new Decimal(item.price || 0);
        const quantity = new Decimal(item.quantity || 0);
        subtotal = subtotal.plus(price.times(quantity));
      }
      
      // Calculate tax (8.25% example rate)
      const tax = subtotal.times(0.0825);
      
      // Calculate total
      const total = subtotal.plus(tax);
      
      // Update cart object
      cart.subtotal = subtotal.toFixed(2);
      cart.tax = tax.toFixed(2);
      cart.total = total.toFixed(2);
      
      // Update in database
      try {
        await db
          .update(carts)
          .set({
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
          })
          .where(eq(carts.id, cart.id));
      } catch (error) {
        console.error("Error updating cart totals in database:", error);
      }
    } catch (error) {
      console.error("Error in recalculateCartTotals:", error);
    }
  }

  // Customer operations
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomers(vendorId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(customer => customer.vendorId === vendorId);
  }

  async getCustomerByEmail(email: string, vendorId: number): Promise<Customer | undefined> {
    return Array.from(this.customers.values())
      .find(customer => customer.vendorId === vendorId && customer.email === email);
  }
  
  async getCustomerByUserId(userId: number, vendorId: number): Promise<Customer | undefined> {
    // Find user by ID
    const user = this.users.get(userId);
    if (!user || !user.email) return undefined;
    
    // Find customer by email and vendor ID
    return Array.from(this.customers.values())
      .find(customer => customer.vendorId === vendorId && customer.email === user.email);
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const id = this.customerId++;
    const customer: Customer = { ...customerData, id, createdAt: new Date() };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = await this.getCustomer(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...data };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  // Customer address operations
  async getCustomerAddress(id: number): Promise<CustomerAddress | undefined> {
    return this.customerAddresses.get(id);
  }

  async getCustomerAddresses(customerId: number): Promise<CustomerAddress[]> {
    return Array.from(this.customerAddresses.values())
      .filter(address => address.customerId === customerId);
  }

  async createCustomerAddress(addressData: InsertCustomerAddress): Promise<CustomerAddress> {
    const id = this.customerAddressId++;
    const address: CustomerAddress = { ...addressData, id, createdAt: new Date() };
    this.customerAddresses.set(id, address);
    return address;
  }

  async updateCustomerAddress(id: number, data: Partial<InsertCustomerAddress>): Promise<CustomerAddress | undefined> {
    const address = await this.getCustomerAddress(id);
    if (!address) return undefined;
    
    const updatedAddress = { ...address, ...data };
    this.customerAddresses.set(id, updatedAddress);
    return updatedAddress;
  }

  async deleteCustomerAddress(id: number): Promise<boolean> {
    return this.customerAddresses.delete(id);
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(vendorId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.vendorId === vendorId);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const order: Order = { 
      ...orderData, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...data, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item operations
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    return this.orderItems.get(id);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(itemData: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const item: OrderItem = { ...itemData, id, createdAt: new Date() };
    this.orderItems.set(id, item);
    return item;
  }

  async updateOrderItem(id: number, data: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    const item = await this.getOrderItem(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...data };
    this.orderItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    return this.orderItems.delete(id);
  }

  // Analytics operations
  async getVendorAnalytics(vendorId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .filter(analytics => analytics.vendorId === vendorId);
  }

  async createAnalyticsEntry(data: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsId++;
    const entry: Analytics = { ...data, id, createdAt: new Date() };
    this.analytics.set(id, entry);
    return entry;
  }
  
  async getTopProducts(vendorId: number, limit: number = 5): Promise<{ name: string, sales: number, revenue: string }[]> {
    // Get all products for this vendor
    const vendorProducts = Array.from(this.products.values())
      .filter(product => product.vendorId === vendorId);
    
    // Get all orders for this vendor
    const vendorOrders = Array.from(this.orders.values())
      .filter(order => order.vendorId === vendorId && order.status === "completed");
    
    // Get all order items for these orders
    const orderItemsList = Array.from(this.orderItems.values())
      .filter(item => {
        const order = this.orders.get(item.orderId);
        return order && order.vendorId === vendorId && order.status === "completed";
      });
    
    // Aggregate sales data by product
    const productSales: Record<number, { name: string, sales: number, revenue: number }> = {};
    
    // Initialize sales data for all products
    vendorProducts.forEach(product => {
      productSales[product.id] = {
        name: product.name,
        sales: 0,
        revenue: 0
      };
    });
    
    // Add up sales for each product
    orderItemsList.forEach(item => {
      const product = this.products.get(item.productId);
      if (product && product.vendorId === vendorId) {
        productSales[product.id].sales += item.quantity;
        productSales[product.id].revenue += parseFloat(item.price) * item.quantity;
      }
    });
    
    // Convert to array, sort by sales and limit results
    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
      .map(product => ({
        name: product.name,
        sales: product.sales,
        revenue: `$${product.revenue.toFixed(2)}`
      }));
  }
  
  async getSalesByHour(vendorId: number): Promise<{ hour: string, sales: number }[]> {
    // Get all orders for this vendor
    const vendorOrders = Array.from(this.orders.values())
      .filter(order => order.vendorId === vendorId && order.status === "completed");
    
    // Group by hour
    const hourMap: Record<number, number> = {};
    
    // Initialize all hours to 0
    for (let i = 0; i < 24; i++) {
      hourMap[i] = 0;
    }
    
    // Count orders by hour
    vendorOrders.forEach(order => {
      if (order.createdAt) {
        const hour = new Date(order.createdAt).getHours();
        hourMap[hour]++;
      }
    });
    
    // Convert to the expected format
    return Object.entries(hourMap)
      .map(([hour, count]) => {
        const hourNum = parseInt(hour);
        let hourLabel: string;
        
        if (hourNum === 0) {
          hourLabel = "12am";
        } else if (hourNum < 12) {
          hourLabel = `${hourNum}am`;
        } else if (hourNum === 12) {
          hourLabel = "12pm";
        } else {
          hourLabel = `${hourNum - 12}pm`;
        }
        
        return {
          hour: hourLabel,
          sales: count
        };
      })
      // Reorder for better visualization - 12am, 3am, 6am, etc.
      .filter((_, index) => index % 3 === 0);
  }
  
  async getSalesByCategory(vendorId: number): Promise<{ name: string, value: number, amount: string }[]> {
    // Get all categories
    const categories = Array.from(this.productCategories.values());
    
    // Get all products for this vendor
    const vendorProducts = Array.from(this.products.values())
      .filter(product => product.vendorId === vendorId);
    
    // Get all order items for these products
    const orderItemsList = Array.from(this.orderItems.values());
    
    // Aggregate sales by category
    const categorySales: Record<number, { name: string, value: number, amount: number }> = {};
    let totalSales = 0;
    
    // Process each order item
    orderItemsList.forEach(item => {
      const product = this.products.get(item.productId);
      const order = this.orders.get(item.orderId);
      
      if (product && order && product.vendorId === vendorId && 
          product.categoryId && order.status === "completed") {
        
        const categoryId = product.categoryId;
        const category = categories.find(c => c.id === categoryId);
        
        if (category) {
          if (!categorySales[categoryId]) {
            categorySales[categoryId] = {
              name: category.name,
              value: 0,
              amount: 0
            };
          }
          
          const amount = parseFloat(item.total);
          categorySales[categoryId].amount += amount;
          totalSales += amount;
        }
      }
    });
    
    // Calculate percentages and format amounts
    return Object.values(categorySales)
      .map(category => ({
        name: category.name,
        value: Math.round((category.amount / (totalSales || 1)) * 100),
        amount: `$${category.amount.toFixed(2)}`
      }))
      .sort((a, b) => b.value - a.value);
  }

  // Payment methods operations
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    const [method] = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, id));
    return method;
  }

  async getPaymentMethodsByVendorId(vendorId: number): Promise<PaymentMethod[]> {
    return db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.vendorId, vendorId));
  }

  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    // If this is marked as default, unmark any other default methods for this vendor
    if (method.isDefault) {
      await db
        .update(paymentMethods)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(
          and(
            eq(paymentMethods.vendorId, method.vendorId),
            eq(paymentMethods.isDefault, true)
          )
        );
    }

    const [createdMethod] = await db
      .insert(paymentMethods)
      .values({
        ...method,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return createdMethod;
  }

  async updatePaymentMethod(id: number, data: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    // If this is being set as default, unmark any other default methods for this vendor
    if (data.isDefault) {
      const [currentMethod] = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, id));

      if (currentMethod && !currentMethod.isDefault) {
        await db
          .update(paymentMethods)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(
            and(
              eq(paymentMethods.vendorId, currentMethod.vendorId),
              eq(paymentMethods.isDefault, true),
              ne(paymentMethods.id, id)
            )
          );
      }
    }

    const [updatedMethod] = await db
      .update(paymentMethods)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(paymentMethods.id, id))
      .returning();
    return updatedMethod;
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    const result = await db
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, id));
    return result.count > 0;
  }

  async setDefaultPaymentMethod(id: number, vendorId: number): Promise<PaymentMethod | undefined> {
    // Unmark any other default methods for this vendor
    await db
      .update(paymentMethods)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(
        and(
          eq(paymentMethods.vendorId, vendorId),
          eq(paymentMethods.isDefault, true),
          ne(paymentMethods.id, id)
        )
      );

    // Mark this method as default
    const [updatedMethod] = await db
      .update(paymentMethods)
      .set({
        isDefault: true,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(paymentMethods.id, id),
          eq(paymentMethods.vendorId, vendorId)
        )
      )
      .returning();
    return updatedMethod;
  }

  // Platform subscription operations
  async getPlatformSubscription(id: number): Promise<PlatformSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(platformSubscriptions)
      .where(eq(platformSubscriptions.id, id));
    return subscription;
  }

  async getPlatformSubscriptionByVendorId(vendorId: number): Promise<PlatformSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(platformSubscriptions)
      .where(
        and(
          eq(platformSubscriptions.vendorId, vendorId),
          eq(platformSubscriptions.status, "active")
        )
      );
    return subscription;
  }

  async createPlatformSubscription(subscription: InsertPlatformSubscription): Promise<PlatformSubscription> {
    const [createdSubscription] = await db
      .insert(platformSubscriptions)
      .values({
        ...subscription,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return createdSubscription;
  }

  async updatePlatformSubscription(id: number, data: Partial<InsertPlatformSubscription>): Promise<PlatformSubscription | undefined> {
    const [updatedSubscription] = await db
      .update(platformSubscriptions)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(platformSubscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  async cancelPlatformSubscription(id: number, reason: string): Promise<PlatformSubscription | undefined> {
    const [canceledSubscription] = await db
      .update(platformSubscriptions)
      .set({
        status: "canceled",
        cancelReason: reason,
        canceledAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(platformSubscriptions.id, id))
      .returning();
    return canceledSubscription;
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceNumber, invoiceNumber));
    return invoice;
  }

  async getInvoicesByVendorId(vendorId: number): Promise<Invoice[]> {
    return db
      .select()
      .from(invoices)
      .where(eq(invoices.vendorId, vendorId))
      .orderBy(desc(invoices.createdAt));
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [createdInvoice] = await db
      .insert(invoices)
      .values({
        ...invoice,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return createdInvoice;
  }

  async updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async markInvoiceAsPaid(id: number): Promise<Invoice | undefined> {
    const [paidInvoice] = await db
      .update(invoices)
      .set({
        status: "paid",
        paidAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(invoices.id, id))
      .returning();
    return paidInvoice;
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async getTransactionsByVendorId(vendorId: number): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.vendorId, vendorId))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByOrderId(orderId: number): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.orderId, orderId))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByInvoiceId(invoiceId: number): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.invoiceId, invoiceId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [createdTransaction] = await db
      .insert(transactions)
      .values({
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return createdTransaction;
  }

  async updateTransaction(id: number, data: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  async processRefund(transactionId: number, amount: string, reason: string): Promise<Transaction | undefined> {
    // Get the original transaction
    const [originalTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId));

    if (!originalTransaction) return undefined;

    // Update the original transaction to mark refund amount
    const refundedAmount = new Decimal(originalTransaction.refundedAmount || "0").plus(amount);
    
    const [updatedTransaction] = await db
      .update(transactions)
      .set({
        refundedAmount: refundedAmount.toString(),
        status: refundedAmount.equals(originalTransaction.amount) ? "refunded" : "partial_refund",
        refundReason: reason || originalTransaction.refundReason,
        updatedAt: new Date()
      })
      .where(eq(transactions.id, transactionId))
      .returning();

    // Create a new refund transaction
    await db
      .insert(transactions)
      .values({
        type: "refund",
        status: "completed",
        amount: amount.toString(),
        currency: originalTransaction.currency || "USD",
        fee: "0",
        net: amount.toString(),
        vendorId: originalTransaction.vendorId,
        orderId: originalTransaction.orderId,
        invoiceId: originalTransaction.invoiceId,
        paymentMethodId: originalTransaction.paymentMethodId,
        metadata: { 
          originalTransactionId: originalTransaction.id,
          refundReason: reason
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    
    return updatedTransaction;
  }

  // Payout operations
  async getPayout(id: number): Promise<Payout | undefined> {
    const [payout] = await db
      .select()
      .from(payouts)
      .where(eq(payouts.id, id));
    return payout;
  }

  async getPayoutsByVendorId(vendorId: number): Promise<Payout[]> {
    return db
      .select()
      .from(payouts)
      .where(eq(payouts.vendorId, vendorId))
      .orderBy(desc(payouts.createdAt));
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    const [createdPayout] = await db
      .insert(payouts)
      .values({
        ...payout,
        createdAt: new Date()
      })
      .returning();
    return createdPayout;
  }

  async updatePayout(id: number, data: Partial<InsertPayout>): Promise<Payout | undefined> {
    const [updatedPayout] = await db
      .update(payouts)
      .set(data)
      .where(eq(payouts.id, id))
      .returning();
    return updatedPayout;
  }

  async completePayout(id: number): Promise<Payout | undefined> {
    const [completedPayout] = await db
      .update(payouts)
      .set({
        status: "completed",
        completedAt: new Date()
      })
      .where(eq(payouts.id, id))
      .returning();
    return completedPayout;
  }

  // Customer payment methods operations
  async getCustomerPaymentMethod(id: number): Promise<CustomerPaymentMethod | undefined> {
    const [method] = await db
      .select()
      .from(customerPaymentMethods)
      .where(eq(customerPaymentMethods.id, id));
    return method;
  }

  async getCustomerPaymentMethodsByCustomerId(customerId: number): Promise<CustomerPaymentMethod[]> {
    return db
      .select()
      .from(customerPaymentMethods)
      .where(eq(customerPaymentMethods.customerId, customerId));
  }

  async createCustomerPaymentMethod(method: InsertCustomerPaymentMethod): Promise<CustomerPaymentMethod> {
    // If this is marked as default, unmark any other default methods for this customer
    if (method.isDefault) {
      await db
        .update(customerPaymentMethods)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(
          and(
            eq(customerPaymentMethods.customerId, method.customerId),
            eq(customerPaymentMethods.isDefault, true)
          )
        );
    }

    const [createdMethod] = await db
      .insert(customerPaymentMethods)
      .values({
        ...method,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return createdMethod;
  }

  async updateCustomerPaymentMethod(id: number, data: Partial<InsertCustomerPaymentMethod>): Promise<CustomerPaymentMethod | undefined> {
    // If this is being set as default, unmark any other default methods for this customer
    if (data.isDefault) {
      const [currentMethod] = await db
        .select()
        .from(customerPaymentMethods)
        .where(eq(customerPaymentMethods.id, id));

      if (currentMethod && !currentMethod.isDefault) {
        await db
          .update(customerPaymentMethods)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(
            and(
              eq(customerPaymentMethods.customerId, currentMethod.customerId),
              eq(customerPaymentMethods.isDefault, true),
              ne(customerPaymentMethods.id, id)
            )
          );
      }
    }

    const [updatedMethod] = await db
      .update(customerPaymentMethods)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(customerPaymentMethods.id, id))
      .returning();
    return updatedMethod;
  }

  async deleteCustomerPaymentMethod(id: number): Promise<boolean> {
    const result = await db
      .delete(customerPaymentMethods)
      .where(eq(customerPaymentMethods.id, id));
    return result.count > 0;
  }

  async setDefaultCustomerPaymentMethod(id: number, customerId: number): Promise<CustomerPaymentMethod | undefined> {
    // Unmark any other default methods for this customer
    await db
      .update(customerPaymentMethods)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(
        and(
          eq(customerPaymentMethods.customerId, customerId),
          eq(customerPaymentMethods.isDefault, true),
          ne(customerPaymentMethods.id, id)
        )
      );

    // Mark this method as default
    const [updatedMethod] = await db
      .update(customerPaymentMethods)
      .set({
        isDefault: true,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(customerPaymentMethods.id, id),
          eq(customerPaymentMethods.customerId, customerId)
        )
      )
      .returning();
    return updatedMethod;
  }

  // Payment provider settings operations
  async getPaymentProviderSettings(id: number): Promise<PaymentProviderSettings | undefined> {
    const [settings] = await db
      .select()
      .from(paymentProviderSettings)
      .where(eq(paymentProviderSettings.id, id));
    return settings;
  }

  async getPaymentProviderSettingsByVendorId(vendorId: number, provider: string): Promise<PaymentProviderSettings | undefined> {
    const [settings] = await db
      .select()
      .from(paymentProviderSettings)
      .where(
        and(
          eq(paymentProviderSettings.vendorId, vendorId),
          eq(paymentProviderSettings.provider, provider)
        )
      );
    return settings;
  }

  async createPaymentProviderSettings(settings: InsertPaymentProviderSettings): Promise<PaymentProviderSettings> {
    const [createdSettings] = await db
      .insert(paymentProviderSettings)
      .values({
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return createdSettings;
  }

  async updatePaymentProviderSettings(id: number, data: Partial<InsertPaymentProviderSettings>): Promise<PaymentProviderSettings | undefined> {
    const [updatedSettings] = await db
      .update(paymentProviderSettings)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(paymentProviderSettings.id, id))
      .returning();
    return updatedSettings;
  }

  async togglePaymentProviderActive(id: number, isActive: boolean): Promise<PaymentProviderSettings | undefined> {
    const [updatedSettings] = await db
      .update(paymentProviderSettings)
      .set({
        isActive,
        updatedAt: new Date()
      })
      .where(eq(paymentProviderSettings.id, id))
      .returning();
    return updatedSettings;
  }

  // Platform statistics
  async getPlatformStats(): Promise<{
    totalVendors: number;
    activeDomains: number;
    totalRevenue: number;
    pendingIssues: number;
  }> {
    const vendors = await this.getVendors();
    const domains = await this.getDomains();
    const activeDomains = domains.filter(domain => domain.status === "active").length;
    
    let totalRevenue = 0;
    // Sum up revenue from all vendors
    for (const vendor of vendors) {
      const vendorOrders = await this.getOrders(vendor.id);
      for (const order of vendorOrders) {
        if (order.paymentStatus === "paid") {
          totalRevenue += Number(order.total);
        }
      }
    }
    
    // Count pending issues (like domains with issues, suspended vendors, etc.)
    const domainsWithIssues = domains.filter(domain => 
      domain.status === "error" || domain.sslStatus === "invalid").length;
    const suspendedVendors = vendors.filter(vendor => vendor.status === "suspended").length;
    const overdueVendors = vendors.filter(vendor => vendor.subscriptionStatus === "overdue").length;
    
    const pendingIssues = domainsWithIssues + suspendedVendors + overdueVendors;
    
    return {
      totalVendors: vendors.length,
      activeDomains,
      totalRevenue,
      pendingIssues
    };
  }
}

import { db } from './db';
import { eq, sql, and, gt, desc } from 'drizzle-orm';
import connectPg from 'connect-pg-simple';
import { pool } from './db';

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Initialize a Postgres-backed session store
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    // Get the current user to check if it's a super_admin
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    
    // If the user is a super_admin, prevent changing the role to protect their privileges
    if (currentUser && currentUser.role === 'super_admin' && 'role' in data && data.role !== 'super_admin') {
      console.warn(`Attempt to change super_admin role for user ${id} was prevented`);
      delete data.role; // Remove the role field to prevent the change
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // OTP operations
  async createOtp(email: string, code: string, expiresAt: Date): Promise<OtpCode> {
    const [otpCode] = await db
      .insert(otpCodes)
      .values({ email, code, expiresAt, isUsed: false })
      .returning();
    return otpCode;
  }

  async getLatestOtp(email: string): Promise<OtpCode | undefined> {
    const now = new Date();
    const [latestOtp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.isUsed, false),
          gt(otpCodes.expiresAt, now)
        )
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);
    return latestOtp;
  }

  async markOtpAsUsed(id: number): Promise<OtpCode | undefined> {
    const [updatedOtp] = await db
      .update(otpCodes)
      .set({ isUsed: true })
      .where(eq(otpCodes.id, id))
      .returning();
    return updatedOtp;
  }

  // Subscription plan operations
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans);
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [newPlan] = await db
      .insert(subscriptionPlans)
      .values(plan)
      .returning();
    return newPlan;
  }

  async updateSubscriptionPlan(id: number, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const [updatedPlan] = await db
      .update(subscriptionPlans)
      .set(data)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return updatedPlan;
  }

  // Vendor operations
  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, id));
    return vendor;
  }

  async getVendors(): Promise<Vendor[]> {
    return db.select().from(vendors);
  }

  async getVendorByUserId(userId: number): Promise<Vendor | undefined> {
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId));
    return vendor;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db
      .insert(vendors)
      .values(vendor)
      .returning();
    return newVendor;
  }

  async updateVendor(id: number, data: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const [updatedVendor] = await db
      .update(vendors)
      .set(data)
      .where(eq(vendors.id, id))
      .returning();
    return updatedVendor;
  }

  // Domain operations
  async getDomain(id: number): Promise<Domain | undefined> {
    const [domain] = await db
      .select()
      .from(domains)
      .where(eq(domains.id, id));
    return domain;
  }

  async getDomains(): Promise<Domain[]> {
    return db.select().from(domains);
  }

  async getDomainsByVendorId(vendorId: number): Promise<Domain[]> {
    return db
      .select()
      .from(domains)
      .where(eq(domains.vendorId, vendorId));
  }

  async getDomainByName(name: string): Promise<Domain | undefined> {
    const [domain] = await db
      .select()
      .from(domains)
      .where(eq(domains.name, name));
    return domain;
  }

  async createDomain(domain: InsertDomain): Promise<Domain> {
    const [newDomain] = await db
      .insert(domains)
      .values(domain)
      .returning();
    return newDomain;
  }

  async updateDomain(id: number, data: Partial<InsertDomain>): Promise<Domain | undefined> {
    const [updatedDomain] = await db
      .update(domains)
      .set(data)
      .where(eq(domains.id, id))
      .returning();
    return updatedDomain;
  }

  async deleteDomain(id: number): Promise<boolean> {
    const result = await db
      .delete(domains)
      .where(eq(domains.id, id));
    return result.count > 0;
  }
  
  async verifyDomain(id: number): Promise<Domain | undefined> {
    // Get the domain
    const domain = await this.getDomain(id);
    if (!domain) return undefined;
    
    // In a real implementation, this would check DNS records for the verification token
    // For now, we'll simulate a successful verification by setting the status to verified
    
    const data = {
      verificationStatus: 'verified',
      status: 'active',
      lastCheckedAt: new Date()
    };
    
    const [updatedDomain] = await db
      .update(domains)
      .set(data)
      .where(eq(domains.id, id))
      .returning();
      
    return updatedDomain;
  }
  
  async generateVerificationToken(id: number): Promise<Domain | undefined> {
    // Generate a random verification token for the domain
    const token = `lelekart-verify-${Math.random().toString(36).substring(2, 15)}`;
    
    const data = {
      verificationToken: token,
      verificationStatus: 'pending',
      lastCheckedAt: new Date()
    };
    
    const [updatedDomain] = await db
      .update(domains)
      .set(data)
      .where(eq(domains.id, id))
      .returning();
      
    return updatedDomain;
  }
  
  async checkDomainsSSL(): Promise<void> {
    // In a real implementation, this would check SSL certificates
    // For this prototype, we'll simulate SSL status updates for active domains
    
    const allDomains = await this.getDomains();
    
    for (const domain of allDomains) {
      if (domain.status === 'active' && domain.verificationStatus === 'verified') {
        await db
          .update(domains)
          .set({ 
            sslStatus: 'active',
            lastCheckedAt: new Date()
          })
          .where(eq(domains.id, domain.id));
      }
    }
  }

  // Product category operations
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const [category] = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.id, id));
    return category;
  }

  async getProductCategories(vendorId: number): Promise<(ProductCategory & { productCount?: number })[]> {
    // Fetch vendor-specific categories and global categories
    const categories = await db
      .select()
      .from(productCategories)
      .where(
        or(
          eq(productCategories.vendorId, vendorId),
          eq(productCategories.isGlobal, true)
        )
      )
      .orderBy(productCategories.level, productCategories.name);
    
    // Get product counts for each category to determine which are in use
    let categoryCounts = [];
    
    // Only query products if vendorId is provided (not null or undefined)
    if (vendorId) {
      categoryCounts = await db.select({
        categoryId: products.categoryId,
        count: db.fn.count(products.id)
      })
      .from(products)
      .where(and(
        eq(products.vendorId, vendorId),
        db.isNotNull(products.categoryId)
      ))
      .groupBy(products.categoryId);
    }
    
    // Create a map of category IDs to product counts
    const countMap = new Map<number, number>();
    
    // Only process categoryCounts if it exists and has items
    if (categoryCounts && categoryCounts.length > 0) {
      for (const item of categoryCounts) {
        if (item.categoryId) {
          countMap.set(item.categoryId, Number(item.count));
        }
      }
    }
    
    // Add product count to each category
    return categories.map(category => ({
      ...category,
      productCount: countMap.get(category.id) || 0
    }));
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [newCategory] = await db
      .insert(productCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateProductCategory(id: number, data: Partial<InsertProductCategory>): Promise<ProductCategory | undefined> {
    const [updatedCategory] = await db
      .update(productCategories)
      .set(data)
      .where(eq(productCategories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async getGlobalProductCategories(): Promise<ProductCategory[]> {
    // Fetch only global categories (for super admin)
    const categories = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.isGlobal, true))
      .orderBy(productCategories.level, productCategories.name);
    
    return categories;
  }
  
  async getAllProductCategories(): Promise<ProductCategory[]> {
    // Fetch all categories (for super admin)
    const categories = await db
      .select()
      .from(productCategories)
      .orderBy(productCategories.level, productCategories.name);
    
    return categories;
  }

  async deleteProductCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(productCategories)
      .where(eq(productCategories.id, id));
    return result.count > 0;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }

  async getProducts(vendorId: number): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.vendorId, vendorId));
  }

  async getProductsByCategory(categoryId: number, includeSubcategories: boolean = false): Promise<Product[]> {
    // If we don't need subcategory products, use the simple query
    if (!includeSubcategories) {
      return db
        .select()
        .from(products)
        .where(eq(products.categoryId, categoryId));
    }
    
    // Get the category to check if it's global
    const [category] = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.id, categoryId));
    
    // If we need to include subcategories, first get all subcategories
    let subcategoriesQuery = db
      .select()
      .from(productCategories)
      .where(eq(productCategories.parentId, categoryId));
    
    // For global categories, we also want to fetch vendor-specific subcategories that point to this global category
    const subcategories = await subcategoriesQuery;
    
    const categoryIds = [categoryId, ...subcategories.map(c => c.id)];
    
    // Then get products from all these categories
    return db
      .select()
      .from(products)
      .where(db.inArray(products.categoryId, categoryIds));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Product variant operations
  async getProductVariant(id: number): Promise<ProductVariant | undefined> {
    const result = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.id, id));
    return result[0];
  }

  async getProductVariantsByProductId(productId: number): Promise<ProductVariant[]> {
    return db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));
  }

  // Customer operations
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id));
    return customer;
  }

  async getCustomers(vendorId: number): Promise<Customer[]> {
    return db
      .select()
      .from(customers)
      .where(eq(customers.vendorId, vendorId));
  }

  async getCustomerByEmail(vendorId: number, email: string): Promise<Customer | undefined> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.vendorId, vendorId))
      .where(eq(customers.email, email));
    return customer;
  }
  
  async getCustomerByUserId(userId: number, vendorId: number): Promise<Customer | undefined> {
    // Get user by ID
    const user = await this.getUser(userId);
    if (!user || !user.email) return undefined;
    
    // Find customer by email and vendor ID
    return this.getCustomerByEmail(vendorId, user.email);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(data)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Customer address operations
  async getCustomerAddress(id: number): Promise<CustomerAddress | undefined> {
    const [address] = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.id, id));
    return address;
  }

  async getCustomerAddresses(customerId: number): Promise<CustomerAddress[]> {
    return db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customerId));
  }

  async createCustomerAddress(address: InsertCustomerAddress): Promise<CustomerAddress> {
    const [newAddress] = await db
      .insert(customerAddresses)
      .values(address)
      .returning();
    return newAddress;
  }

  async updateCustomerAddress(id: number, data: Partial<InsertCustomerAddress>): Promise<CustomerAddress | undefined> {
    const [updatedAddress] = await db
      .update(customerAddresses)
      .set(data)
      .where(eq(customerAddresses.id, id))
      .returning();
    return updatedAddress;
  }

  async deleteCustomerAddress(id: number): Promise<boolean> {
    const result = await db
      .delete(customerAddresses)
      .where(eq(customerAddresses.id, id));
    return result.count > 0;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order;
  }

  async getOrders(vendorId: number): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.vendorId, vendorId));
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set(data)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order item operations
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    const [item] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, id));
    return item;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db
      .insert(orderItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateOrderItem(id: number, data: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    const [updatedItem] = await db
      .update(orderItems)
      .set(data)
      .where(eq(orderItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    const result = await db
      .delete(orderItems)
      .where(eq(orderItems.id, id));
    return result.count > 0;
  }

  // Analytics operations
  async getVendorAnalytics(vendorId: number): Promise<Analytics[]> {
    return db
      .select()
      .from(analytics)
      .where(eq(analytics.vendorId, vendorId));
  }

  async createAnalyticsEntry(data: InsertAnalytics): Promise<Analytics> {
    const [newEntry] = await db
      .insert(analytics)
      .values(data)
      .returning();
    return newEntry;
  }
  
  async getTopProducts(vendorId: number, limit: number = 5): Promise<{ name: string, sales: number, revenue: string }[]> {
    // Get all order items for this vendor's products
    const items = await db
      .select({
        productId: orderItems.productId,
        productName: products.name,
        quantity: orderItems.quantity,
        price: orderItems.price
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(products.vendorId, vendorId))
      .where(eq(orders.status, "completed"));
      
    // Aggregate the data
    const productSales: Record<number, { name: string, sales: number, revenue: number }> = {};
    
    items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.productName,
          sales: 0,
          revenue: 0
        };
      }
      
      productSales[item.productId].sales += item.quantity;
      productSales[item.productId].revenue += parseFloat(item.price.toString()) * item.quantity;
    });
    
    // Convert to array and sort by sales
    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
      .map(product => ({
        name: product.name,
        sales: product.sales,
        revenue: `$${product.revenue.toFixed(2)}`
      }));
  }
  
  async getSalesByHour(vendorId: number): Promise<{ hour: string, sales: number }[]> {
    // Get all orders for this vendor
    const vendorOrders = await db
      .select({
        createdAt: orders.createdAt,
        status: orders.status
      })
      .from(orders)
      .where(eq(orders.vendorId, vendorId))
      .where(eq(orders.status, "completed"));
    
    // Group by hour
    const hourMap: Record<number, number> = {};
    
    // Initialize all hours to 0
    for (let i = 0; i < 24; i++) {
      hourMap[i] = 0;
    }
    
    vendorOrders.forEach(order => {
      if (order.createdAt) {
        const hour = new Date(order.createdAt).getHours();
        hourMap[hour]++;
      }
    });
    
    // Convert to the expected format
    return Object.entries(hourMap)
      .map(([hour, count]) => {
        const hourNum = parseInt(hour);
        let hourLabel: string;
        
        if (hourNum === 0) {
          hourLabel = "12am";
        } else if (hourNum < 12) {
          hourLabel = `${hourNum}am`;
        } else if (hourNum === 12) {
          hourLabel = "12pm";
        } else {
          hourLabel = `${hourNum - 12}pm`;
        }
        
        return {
          hour: hourLabel,
          sales: count
        };
      })
      // Reorder for better visualization - 12am, 3am, 6am, etc.
      .filter((_, index) => index % 3 === 0);
  }
  
  async getSalesByCategory(vendorId: number): Promise<{ name: string, value: number, amount: string }[]> {
    // Get product sales by category
    const items = await db
      .select({
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        total: orderItems.total
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(products.vendorId, vendorId))
      .where(eq(orders.status, "completed"));
    
    // Aggregate by category
    const categorySales: Record<number, { name: string, value: number, amount: number }> = {};
    let totalSales = 0;
    
    items.forEach(item => {
      if (item.categoryId) {
        if (!categorySales[item.categoryId]) {
          categorySales[item.categoryId] = {
            name: item.categoryName || "Uncategorized",
            value: 0,
            amount: 0
          };
        }
        
        const amount = parseFloat(item.total.toString());
        categorySales[item.categoryId].amount += amount;
        totalSales += amount;
      }
    });
    
    // Calculate percentages and format amounts
    return Object.values(categorySales)
      .map(category => ({
        name: category.name,
        value: Math.round((category.amount / (totalSales || 1)) * 100),
        amount: `$${category.amount.toFixed(2)}`
      }))
      .sort((a, b) => b.value - a.value);
  }

  // Platform statistics - we'll use SQL aggregation for better performance
  async getPlatformStats(): Promise<{ totalVendors: number; activeDomains: number; totalRevenue: number; pendingIssues: number; }> {
    // Get total vendors
    const [vendorCount] = await db
      .select({ count: sql`count(*)` })
      .from(vendors);
    
    // Get active domains
    const [domainsCount] = await db
      .select({ count: sql`count(*)` })
      .from(domains)
      .where(eq(domains.status, 'active'));
    
    // Get total revenue (sum of all orders)
    const [revenue] = await db
      .select({ sum: sql`sum(cast(total as decimal))` })
      .from(orders);
    
    // Get count of pending issues (domains with verification issues)
    const [issuesCount] = await db
      .select({ count: sql`count(*)` })
      .from(domains)
      .where(eq(domains.verificationStatus, 'pending'));
    
    return {
      totalVendors: Number(vendorCount?.count || 0),
      activeDomains: Number(domainsCount?.count || 0),
      totalRevenue: Number(revenue?.sum || 0),
      pendingIssues: Number(issuesCount?.count || 0)
    };
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
