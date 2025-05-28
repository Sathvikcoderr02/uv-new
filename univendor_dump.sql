--
-- PostgreSQL database dump
--

-- Dumped from database version 14.16 (Homebrew)
-- Dumped by pg_dump version 14.16 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_subscription_plan_id_subscription_plans_id_fk;
ALTER TABLE IF EXISTS ONLY public.transactions DROP CONSTRAINT IF EXISTS transactions_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.transactions DROP CONSTRAINT IF EXISTS transactions_payment_method_id_payment_methods_id_fk;
ALTER TABLE IF EXISTS ONLY public.transactions DROP CONSTRAINT IF EXISTS transactions_order_id_orders_id_fk;
ALTER TABLE IF EXISTS ONLY public.transactions DROP CONSTRAINT IF EXISTS transactions_invoice_id_invoices_id_fk;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_product_categories_id_fk;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.product_categories DROP CONSTRAINT IF EXISTS product_categories_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.product_categories DROP CONSTRAINT IF EXISTS product_categories_parent_id_product_categories_id_fk;
ALTER TABLE IF EXISTS ONLY public.platform_subscriptions DROP CONSTRAINT IF EXISTS platform_subscriptions_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.platform_subscriptions DROP CONSTRAINT IF EXISTS platform_subscriptions_plan_id_subscription_plans_id_fk;
ALTER TABLE IF EXISTS ONLY public.platform_subscriptions DROP CONSTRAINT IF EXISTS platform_subscriptions_payment_method_id_payment_methods_id_fk;
ALTER TABLE IF EXISTS ONLY public.payouts DROP CONSTRAINT IF EXISTS payouts_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.payment_provider_settings DROP CONSTRAINT IF EXISTS payment_provider_settings_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.payment_methods DROP CONSTRAINT IF EXISTS payment_methods_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_customer_id_customers_id_fk;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_orders_id_fk;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_subscription_id_platform_subscriptions_id_fk;
ALTER TABLE IF EXISTS ONLY public.domains DROP CONSTRAINT IF EXISTS domains_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.customer_payment_methods DROP CONSTRAINT IF EXISTS customer_payment_methods_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.customer_payment_methods DROP CONSTRAINT IF EXISTS customer_payment_methods_customer_id_customers_id_fk;
ALTER TABLE IF EXISTS ONLY public.customer_addresses DROP CONSTRAINT IF EXISTS customer_addresses_customer_id_customers_id_fk;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_vendor_id_vendors_id_fk;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_products_id_fk;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_carts_id_fk;
ALTER TABLE IF EXISTS ONLY public.analytics DROP CONSTRAINT IF EXISTS analytics_vendor_id_vendors_id_fk;
DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.transactions DROP CONSTRAINT IF EXISTS transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_name_unique;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS product_variants_pkey;
ALTER TABLE IF EXISTS ONLY public.product_categories DROP CONSTRAINT IF EXISTS product_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.platform_subscriptions DROP CONSTRAINT IF EXISTS platform_subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.payouts DROP CONSTRAINT IF EXISTS payouts_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_provider_settings DROP CONSTRAINT IF EXISTS payment_provider_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_methods DROP CONSTRAINT IF EXISTS payment_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.otp_codes DROP CONSTRAINT IF EXISTS otp_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_order_number_unique;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_pkey;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_invoice_number_unique;
ALTER TABLE IF EXISTS ONLY public.domains DROP CONSTRAINT IF EXISTS domains_pkey;
ALTER TABLE IF EXISTS ONLY public.domains DROP CONSTRAINT IF EXISTS domains_name_unique;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.customer_payment_methods DROP CONSTRAINT IF EXISTS customer_payment_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.customer_addresses DROP CONSTRAINT IF EXISTS customer_addresses_pkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public.analytics DROP CONSTRAINT IF EXISTS analytics_pkey;
ALTER TABLE IF EXISTS public.vendors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.subscription_plans ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_variants ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.platform_subscriptions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payouts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payment_provider_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payment_methods ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.otp_codes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.invoices ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.domains ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customer_payment_methods ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customer_addresses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.carts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cart_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.analytics ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.vendors_id_seq;
DROP TABLE IF EXISTS public.vendors;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.transactions_id_seq;
DROP TABLE IF EXISTS public.transactions;
DROP SEQUENCE IF EXISTS public.subscription_plans_id_seq;
DROP TABLE IF EXISTS public.subscription_plans;
DROP TABLE IF EXISTS public.session;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.product_variants_id_seq;
DROP TABLE IF EXISTS public.product_variants;
DROP SEQUENCE IF EXISTS public.product_categories_id_seq;
DROP TABLE IF EXISTS public.product_categories;
DROP SEQUENCE IF EXISTS public.platform_subscriptions_id_seq;
DROP TABLE IF EXISTS public.platform_subscriptions;
DROP SEQUENCE IF EXISTS public.payouts_id_seq;
DROP TABLE IF EXISTS public.payouts;
DROP SEQUENCE IF EXISTS public.payment_provider_settings_id_seq;
DROP TABLE IF EXISTS public.payment_provider_settings;
DROP SEQUENCE IF EXISTS public.payment_methods_id_seq;
DROP TABLE IF EXISTS public.payment_methods;
DROP SEQUENCE IF EXISTS public.otp_codes_id_seq;
DROP TABLE IF EXISTS public.otp_codes;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_items_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.invoices_id_seq;
DROP TABLE IF EXISTS public.invoices;
DROP SEQUENCE IF EXISTS public.domains_id_seq;
DROP TABLE IF EXISTS public.domains;
DROP SEQUENCE IF EXISTS public.customers_id_seq;
DROP TABLE IF EXISTS public.customers;
DROP SEQUENCE IF EXISTS public.customer_payment_methods_id_seq;
DROP TABLE IF EXISTS public.customer_payment_methods;
DROP SEQUENCE IF EXISTS public.customer_addresses_id_seq;
DROP TABLE IF EXISTS public.customer_addresses;
DROP SEQUENCE IF EXISTS public.carts_id_seq;
DROP TABLE IF EXISTS public.carts;
DROP SEQUENCE IF EXISTS public.cart_items_id_seq;
DROP TABLE IF EXISTS public.cart_items;
DROP SEQUENCE IF EXISTS public.analytics_id_seq;
DROP TABLE IF EXISTS public.analytics;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    visitors integer DEFAULT 0,
    page_views integer DEFAULT 0,
    orders integer DEFAULT 0,
    revenue numeric DEFAULT '0'::numeric,
    conversion_rate numeric DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.analytics OWNER TO postgres;

--
-- Name: analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.analytics_id_seq OWNER TO postgres;

--
-- Name: analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_id_seq OWNED BY public.analytics.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    variant text,
    image_url text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer,
    session_id text,
    vendor_id integer NOT NULL,
    subtotal numeric DEFAULT '0'::numeric,
    tax numeric DEFAULT '0'::numeric,
    total numeric DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_id_seq OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_addresses (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customer_addresses OWNER TO postgres;

--
-- Name: customer_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_addresses_id_seq OWNER TO postgres;

--
-- Name: customer_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_addresses_id_seq OWNED BY public.customer_addresses.id;


--
-- Name: customer_payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_payment_methods (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    vendor_id integer NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false,
    status text DEFAULT 'active'::text,
    last_four text,
    expiry_month text,
    expiry_year text,
    brand text,
    gateway_id text,
    gateway_data jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customer_payment_methods OWNER TO postgres;

--
-- Name: customer_payment_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_payment_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_payment_methods_id_seq OWNER TO postgres;

--
-- Name: customer_payment_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_payment_methods_id_seq OWNED BY public.customer_payment_methods.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    total_orders integer DEFAULT 0,
    total_spent numeric DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: domains; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domains (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ssl_status text DEFAULT 'pending'::text,
    is_primary boolean DEFAULT false,
    verification_status text DEFAULT 'pending'::text,
    verification_token text,
    verification_method text DEFAULT 'dns_txt'::text,
    dns_records text[],
    last_checked_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone
);


ALTER TABLE public.domains OWNER TO postgres;

--
-- Name: domains_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.domains_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.domains_id_seq OWNER TO postgres;

--
-- Name: domains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.domains_id_seq OWNED BY public.domains.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    subscription_id integer,
    invoice_number text NOT NULL,
    amount numeric NOT NULL,
    tax numeric DEFAULT '0'::numeric,
    total numeric NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    currency text DEFAULT 'USD'::text,
    due_date timestamp without time zone NOT NULL,
    paid_at timestamp without time zone,
    notes text,
    pdf_url text,
    gateway_invoice_id text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    name text NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    total numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    customer_id integer,
    order_number text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    currency text DEFAULT 'USD'::text,
    subtotal numeric NOT NULL,
    shipping_cost numeric DEFAULT '0'::numeric,
    tax numeric DEFAULT '0'::numeric,
    discount numeric DEFAULT '0'::numeric,
    total numeric NOT NULL,
    shipping_address text,
    billing_address text,
    payment_status text DEFAULT 'pending'::text,
    payment_method text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_codes (
    id integer NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.otp_codes OWNER TO postgres;

--
-- Name: otp_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otp_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.otp_codes_id_seq OWNER TO postgres;

--
-- Name: otp_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otp_codes_id_seq OWNED BY public.otp_codes.id;


--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false,
    status text DEFAULT 'active'::text,
    last_four text,
    expiry_month text,
    expiry_year text,
    brand text,
    gateway_id text,
    gateway_data jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: payment_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_methods_id_seq OWNER TO postgres;

--
-- Name: payment_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_methods_id_seq OWNED BY public.payment_methods.id;


--
-- Name: payment_provider_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_provider_settings (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    provider text NOT NULL,
    is_active boolean DEFAULT false,
    is_test boolean DEFAULT true,
    credentials jsonb,
    webhook_secret text,
    commission_rate numeric DEFAULT '0'::numeric,
    additional_settings jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payment_provider_settings OWNER TO postgres;

--
-- Name: payment_provider_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_provider_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_provider_settings_id_seq OWNER TO postgres;

--
-- Name: payment_provider_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_provider_settings_id_seq OWNED BY public.payment_provider_settings.id;


--
-- Name: payouts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payouts (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'USD'::text,
    fee numeric DEFAULT '0'::numeric,
    net numeric NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    method text NOT NULL,
    batch_id text,
    gateway_payout_id text,
    gateway_response jsonb,
    notes text,
    transaction_ids integer[],
    created_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone
);


ALTER TABLE public.payouts OWNER TO postgres;

--
-- Name: payouts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payouts_id_seq OWNER TO postgres;

--
-- Name: payouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payouts_id_seq OWNED BY public.payouts.id;


--
-- Name: platform_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_subscriptions (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    plan_id integer NOT NULL,
    status text DEFAULT 'trialing'::text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    trial_ends_at timestamp without time zone,
    current_period_start timestamp without time zone,
    current_period_end timestamp without time zone,
    cancel_at_period_end boolean DEFAULT false,
    renewal_date timestamp without time zone,
    billing_cycle text DEFAULT 'monthly'::text NOT NULL,
    amount numeric,
    currency text DEFAULT 'USD'::text,
    payment_method_id integer,
    stripe_customer_id text,
    stripe_subscription_id text,
    canceled_at timestamp without time zone,
    cancel_reason text,
    payment_failure_count integer DEFAULT 0,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.platform_subscriptions OWNER TO postgres;

--
-- Name: platform_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platform_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platform_subscriptions_id_seq OWNER TO postgres;

--
-- Name: platform_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platform_subscriptions_id_seq OWNED BY public.platform_subscriptions.id;


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id integer NOT NULL,
    vendor_id integer,
    name text NOT NULL,
    description text,
    slug text NOT NULL,
    image_url text,
    parent_id integer,
    level integer DEFAULT 1,
    is_active boolean DEFAULT true,
    is_global boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- Name: product_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_categories_id_seq OWNER TO postgres;

--
-- Name: product_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer NOT NULL,
    color text NOT NULL,
    size text NOT NULL,
    sku text,
    barcode text,
    purchase_price numeric,
    selling_price numeric NOT NULL,
    mrp numeric,
    gst numeric,
    inventory_quantity integer DEFAULT 0,
    weight numeric,
    image_url text,
    images text[],
    "position" integer DEFAULT 0,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_variants_id_seq OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    category_id integer,
    name text NOT NULL,
    description text,
    purchase_price numeric,
    selling_price numeric NOT NULL,
    mrp numeric,
    gst numeric,
    sku text,
    barcode text,
    weight numeric,
    dimensions text,
    inventory_quantity integer DEFAULT 0,
    status text DEFAULT 'draft'::text,
    featured_image_url text,
    images text[],
    tags text[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_featured boolean DEFAULT false
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    yearly_price numeric,
    features text[],
    product_limit integer NOT NULL,
    storage_limit integer NOT NULL,
    custom_domain_limit integer NOT NULL,
    support_level text NOT NULL,
    trial_days integer DEFAULT 7,
    is_active boolean DEFAULT true NOT NULL,
    is_default boolean DEFAULT false,
    stripe_price_id_monthly text,
    stripe_price_id_yearly text,
    currency text DEFAULT 'INR'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.subscription_plans OWNER TO postgres;

--
-- Name: subscription_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscription_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subscription_plans_id_seq OWNER TO postgres;

--
-- Name: subscription_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'USD'::text,
    fee numeric DEFAULT '0'::numeric,
    net numeric NOT NULL,
    vendor_id integer NOT NULL,
    invoice_id integer,
    order_id integer,
    payment_method_id integer,
    gateway_transaction_id text,
    gateway_response jsonb,
    refunded_amount numeric DEFAULT '0'::numeric,
    refund_reason text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    role text DEFAULT 'vendor'::text NOT NULL,
    avatar_url text,
    is_profile_complete boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_name text NOT NULL,
    description text,
    logo_url text,
    subscription_plan_id integer,
    status text DEFAULT 'pending'::text NOT NULL,
    store_theme text DEFAULT 'default'::text,
    custom_css text,
    color_palette text DEFAULT 'default'::text,
    font_settings jsonb,
    created_at timestamp without time zone DEFAULT now(),
    subscription_status text DEFAULT 'trial'::text,
    trial_ends_at timestamp without time zone,
    next_billing_date timestamp without time zone
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vendors_id_seq OWNER TO postgres;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics ALTER COLUMN id SET DEFAULT nextval('public.analytics_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: customer_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses ALTER COLUMN id SET DEFAULT nextval('public.customer_addresses_id_seq'::regclass);


--
-- Name: customer_payment_methods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_payment_methods ALTER COLUMN id SET DEFAULT nextval('public.customer_payment_methods_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: domains id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domains ALTER COLUMN id SET DEFAULT nextval('public.domains_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: otp_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_codes ALTER COLUMN id SET DEFAULT nextval('public.otp_codes_id_seq'::regclass);


--
-- Name: payment_methods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods ALTER COLUMN id SET DEFAULT nextval('public.payment_methods_id_seq'::regclass);


--
-- Name: payment_provider_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider_settings ALTER COLUMN id SET DEFAULT nextval('public.payment_provider_settings_id_seq'::regclass);


--
-- Name: payouts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payouts ALTER COLUMN id SET DEFAULT nextval('public.payouts_id_seq'::regclass);


--
-- Name: platform_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.platform_subscriptions_id_seq'::regclass);


--
-- Name: product_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics (id, vendor_id, date, visitors, page_views, orders, revenue, conversion_rate, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, name, price, quantity, variant, image_url, created_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, user_id, session_id, vendor_id, subtotal, tax, total, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_addresses (id, customer_id, address_line1, address_line2, city, state, postal_code, country, is_default, created_at) FROM stdin;
\.


--
-- Data for Name: customer_payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_payment_methods (id, customer_id, vendor_id, type, name, is_default, status, last_four, expiry_month, expiry_year, brand, gateway_id, gateway_data, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, vendor_id, email, first_name, last_name, phone, total_orders, total_spent, created_at) FROM stdin;
\.


--
-- Data for Name: domains; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.domains (id, vendor_id, name, type, status, ssl_status, is_primary, verification_status, verification_token, verification_method, dns_records, last_checked_at, created_at, expires_at) FROM stdin;
1	2	sathvik-store.multivend.com	subdomain	active	pending	t	verified	\N	dns_txt	\N	\N	2025-05-22 17:40:54.568005	\N
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, vendor_id, subscription_id, invoice_number, amount, tax, total, status, currency, due_date, paid_at, notes, pdf_url, gateway_invoice_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, name, quantity, price, total, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, vendor_id, customer_id, order_number, status, currency, subtotal, shipping_cost, tax, discount, total, shipping_address, billing_address, payment_status, payment_method, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_codes (id, email, code, expires_at, is_used, created_at) FROM stdin;
1	sathvik1702@gmail.com	123456	2025-05-22 18:00:17.168603	f	2025-05-22 17:50:17.168603
2	sathvik1702@gmail.com	372988	2025-05-22 13:45:00.584	t	2025-05-22 19:05:00.672204
3	sathvik1702@gmail.com	974491	2025-05-22 17:45:05.126	f	2025-05-22 23:05:05.129319
4	sathvik1702@gmail.com	750582	2025-05-22 17:55:45.769	f	2025-05-22 23:15:45.774937
5	sathvik1702@gmail.com	516407	2025-05-22 17:58:32.453	f	2025-05-22 23:18:32.45583
6	sathvik1702@gmail.com	710729	2025-05-22 18:01:42.489	f	2025-05-22 23:21:42.489932
7	sathvik1702@gmail.com	368113	2025-05-22 18:01:57.945	f	2025-05-22 23:21:57.946592
8	sathvik1702@gmail.com	701310	2025-05-22 18:04:50.313	f	2025-05-22 23:24:50.31831
9	sathvik1702@gmail.com	365788	2025-05-22 18:06:28.117	f	2025-05-22 23:26:28.118702
10	sathvik1702@gmail.com	714960	2025-05-22 18:11:07.967	t	2025-05-22 23:31:07.970086
11	sathvik1702@gmail.com	130826	2025-05-22 19:42:36.573	f	2025-05-23 01:02:36.574864
12	sathvik1702@gmail.com	227291	2025-05-22 19:44:57.512	f	2025-05-23 01:04:57.513735
13	sathvik1702@gmail.com	323955	2025-05-23 16:59:55.829	f	2025-05-23 22:19:55.830363
14	sathvik1702@gmail.com	929200	2025-05-27 15:39:52.389	f	2025-05-27 20:59:52.394366
15	sathvik1702@gmail.com	231475	2025-05-27 15:41:54.151	t	2025-05-27 21:01:54.1524
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, vendor_id, type, name, is_default, status, last_four, expiry_month, expiry_year, brand, gateway_id, gateway_data, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_provider_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_provider_settings (id, vendor_id, provider, is_active, is_test, credentials, webhook_secret, commission_rate, additional_settings, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payouts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payouts (id, vendor_id, amount, currency, fee, net, status, method, batch_id, gateway_payout_id, gateway_response, notes, transaction_ids, created_at, completed_at) FROM stdin;
\.


--
-- Data for Name: platform_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_subscriptions (id, vendor_id, plan_id, status, start_date, end_date, trial_ends_at, current_period_start, current_period_end, cancel_at_period_end, renewal_date, billing_cycle, amount, currency, payment_method_id, stripe_customer_id, stripe_subscription_id, canceled_at, cancel_reason, payment_failure_count, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, vendor_id, name, description, slug, image_url, parent_id, level, is_active, is_global, created_at) FROM stdin;
1	1	Electronics	Electronic gadgets and devices	electronics	\N	\N	1	t	f	2025-05-22 15:41:22.530489
2	1	Clothing	Fashion and apparel	clothing	\N	\N	1	t	f	2025-05-22 15:41:22.530489
3	1	Home & Kitchen	Home and kitchen products	home-kitchen	\N	\N	1	t	f	2025-05-22 15:41:22.530489
5	2	General	\N	general	\N	\N	1	t	f	2025-05-22 20:28:31.500449
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, product_id, color, size, sku, barcode, purchase_price, selling_price, mrp, gst, inventory_quantity, weight, image_url, images, "position", is_default, created_at, updated_at) FROM stdin;
1	3	Blue	M	\N	\N	\N	59.99	\N	\N	30	\N	https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-22 19:12:54.262109	2025-05-22 19:12:54.262109
2	3	White	M	\N	\N	\N	59.99	\N	\N	35	\N	https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-22 19:12:54.262109	2025-05-22 19:12:54.262109
3	3	Black	M	\N	\N	\N	64.99	\N	\N	25	\N	https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-22 19:12:54.262109	2025-05-22 19:12:54.262109
4	3	Blue	M	\N	\N	\N	59.99	\N	\N	30	\N	https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	t	2025-05-22 19:32:32.425599	2025-05-22 19:32:32.425599
5	3	White	M	\N	\N	\N	59.99	\N	\N	35	\N	https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-22 19:32:41.810932	2025-05-22 19:32:41.810932
6	3	Black	M	\N	\N	\N	64.99	\N	\N	25	\N	https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-22 19:32:50.801874	2025-05-22 19:32:50.801874
7	4	Black	S	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	t	2025-05-22 20:26:09.997801	2025-05-22 20:26:09.997801
8	4	Black	M	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:26:09.999108	2025-05-22 20:26:09.999108
9	4	Black	L	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:26:10.000063	2025-05-22 20:26:10.000063
10	4	White	S	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:26:10.001075	2025-05-22 20:26:10.001075
11	4	White	M	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:26:10.002029	2025-05-22 20:26:10.002029
12	4	White	L	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:26:10.002955	2025-05-22 20:26:10.002955
13	5	Black	S	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	t	2025-05-22 20:26:10.005899	2025-05-22 20:26:10.005899
14	5	Black	M	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:26:10.006679	2025-05-22 20:26:10.006679
15	5	Black	L	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:26:10.00751	2025-05-22 20:26:10.00751
16	5	White	S	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:26:10.00824	2025-05-22 20:26:10.00824
17	5	White	M	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:26:10.009023	2025-05-22 20:26:10.009023
18	5	White	L	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:26:10.009711	2025-05-22 20:26:10.009711
19	6	Black	S	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	t	2025-05-22 20:26:10.012399	2025-05-22 20:26:10.012399
20	6	Black	M	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:26:10.013219	2025-05-22 20:26:10.013219
21	6	Black	L	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:26:10.014077	2025-05-22 20:26:10.014077
22	6	White	S	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:26:10.014908	2025-05-22 20:26:10.014908
23	6	White	M	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:26:10.015722	2025-05-22 20:26:10.015722
24	6	White	L	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:26:10.016398	2025-05-22 20:26:10.016398
25	7	Black	S	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	t	2025-05-22 20:26:10.019272	2025-05-22 20:26:10.019272
26	7	Black	M	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:26:10.020148	2025-05-22 20:26:10.020148
27	7	Black	L	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:26:10.021397	2025-05-22 20:26:10.021397
28	7	White	S	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:26:10.02264	2025-05-22 20:26:10.02264
29	7	White	M	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:26:10.023567	2025-05-22 20:26:10.023567
30	7	White	L	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:26:10.024581	2025-05-22 20:26:10.024581
31	8	Black	S	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	t	2025-05-22 20:26:10.027008	2025-05-22 20:26:10.027008
32	8	Black	M	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:26:10.027838	2025-05-22 20:26:10.027838
33	8	Black	L	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:26:10.028955	2025-05-22 20:26:10.028955
34	8	White	S	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:26:10.029951	2025-05-22 20:26:10.029951
35	8	White	M	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:26:10.030632	2025-05-22 20:26:10.030632
36	8	White	L	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:26:10.031749	2025-05-22 20:26:10.031749
37	9	Black	S	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	t	2025-05-22 20:28:31.760019	2025-05-22 20:28:31.760019
38	9	Black	M	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:28:31.801559	2025-05-22 20:28:31.801559
39	9	Black	L	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:28:31.883719	2025-05-22 20:28:31.883719
40	9	White	S	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:28:31.966359	2025-05-22 20:28:31.966359
41	9	White	M	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:28:32.00784	2025-05-22 20:28:32.00784
42	9	White	L	\N	\N	\N	19.99	24.99	\N	16	\N	\N	\N	0	f	2025-05-22 20:28:32.04922	2025-05-22 20:28:32.04922
43	10	Black	S	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	t	2025-05-22 20:28:32.184495	2025-05-22 20:28:32.184495
44	10	Black	M	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:28:32.226207	2025-05-22 20:28:32.226207
45	10	Black	L	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:28:32.267842	2025-05-22 20:28:32.267842
46	10	White	S	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:28:32.309018	2025-05-22 20:28:32.309018
47	10	White	M	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:28:32.390839	2025-05-22 20:28:32.390839
48	10	White	L	\N	\N	\N	39.99	49.99	\N	8	\N	\N	\N	0	f	2025-05-22 20:28:32.432205	2025-05-22 20:28:32.432205
49	11	Black	S	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	t	2025-05-22 20:28:32.516041	2025-05-22 20:28:32.516041
50	11	Black	M	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:28:32.597549	2025-05-22 20:28:32.597549
51	11	Black	L	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:28:32.638415	2025-05-22 20:28:32.638415
52	11	White	S	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:28:32.679515	2025-05-22 20:28:32.679515
53	11	White	M	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:28:32.731046	2025-05-22 20:28:32.731046
54	11	White	L	\N	\N	\N	29.99	34.99	\N	12	\N	\N	\N	0	f	2025-05-22 20:28:32.812449	2025-05-22 20:28:32.812449
55	12	Black	S	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	t	2025-05-22 20:28:32.905684	2025-05-22 20:28:32.905684
56	12	Black	M	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:28:32.94692	2025-05-22 20:28:32.94692
57	12	Black	L	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:28:32.987997	2025-05-22 20:28:32.987997
58	12	White	S	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:28:33.028848	2025-05-22 20:28:33.028848
59	12	White	M	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:28:33.069835	2025-05-22 20:28:33.069835
60	12	White	L	\N	\N	\N	59.99	69.99	\N	5	\N	\N	\N	0	f	2025-05-22 20:28:33.111627	2025-05-22 20:28:33.111627
61	13	Black	S	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	t	2025-05-22 20:28:33.194716	2025-05-22 20:28:33.194716
62	13	Black	M	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:28:33.236265	2025-05-22 20:28:33.236265
63	13	Black	L	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:28:33.27744	2025-05-22 20:28:33.27744
64	13	White	S	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:28:33.318498	2025-05-22 20:28:33.318498
65	13	White	M	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:28:33.35941	2025-05-22 20:28:33.35941
66	13	White	L	\N	\N	\N	24.99	29.99	\N	10	\N	\N	\N	0	f	2025-05-22 20:28:33.400516	2025-05-22 20:28:33.400516
67	14	Blue	M	\N	\N	\N	59.99	79.99	\N	20	\N	https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	t	2025-05-27 22:07:48.312268	2025-05-27 22:07:48.312268
68	14	White	M	\N	\N	\N	59.99	79.99	\N	25	\N	https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-27 22:07:48.312268	2025-05-27 22:07:48.312268
69	14	Black	M	\N	\N	\N	59.99	79.99	\N	15	\N	https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3	\N	0	f	2025-05-27 22:07:48.312268	2025-05-27 22:07:48.312268
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, vendor_id, category_id, name, description, purchase_price, selling_price, mrp, gst, sku, barcode, weight, dimensions, inventory_quantity, status, featured_image_url, images, tags, created_at, updated_at, is_featured) FROM stdin;
1	1	1	Wireless Headphones	High-quality wireless bluetooth headphones with noise cancellation	\N	89.99	\N	\N	WH-001	\N	\N	\N	50	active	https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3	\N	\N	2025-05-22 15:41:22.533476	2025-05-22 15:41:22.533476	f
2	1	1	Smartphone	Latest model smartphone with advanced camera and long battery life	\N	699.99	\N	\N	SP-002	\N	\N	\N	25	active	https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.0.3	\N	\N	2025-05-22 15:41:22.533476	2025-05-22 15:41:22.533476	f
4	1	1	Classic T-Shirt	A comfortable cotton t-shirt for everyday wear	\N	19.99	24.99	\N	\N	\N	\N	\N	100	active	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500	\N	\N	2025-05-22 20:26:09.995334	2025-05-22 20:26:09.995334	f
5	1	1	Slim Fit Jeans	Modern slim fit jeans with stretch comfort	\N	39.99	49.99	\N	\N	\N	\N	\N	50	active	https://images.unsplash.com/photo-1542272604-787c3835535d?w=500	\N	\N	2025-05-22 20:26:10.004713	2025-05-22 20:26:10.004713	f
6	1	1	Casual Hoodie	Warm and comfortable hoodie for casual wear	\N	29.99	34.99	\N	\N	\N	\N	\N	75	active	https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500	\N	\N	2025-05-22 20:26:10.01109	2025-05-22 20:26:10.01109	f
7	1	1	Running Shoes	Lightweight running shoes with cushioned soles	\N	59.99	69.99	\N	\N	\N	\N	\N	30	active	https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500	\N	\N	2025-05-22 20:26:10.017832	2025-05-22 20:26:10.017832	f
8	1	1	Leather Wallet	Genuine leather wallet with multiple card slots	\N	24.99	29.99	\N	\N	\N	\N	\N	60	active	https://images.unsplash.com/photo-1627123424574-724758594e93?w=500	\N	\N	2025-05-22 20:26:10.025755	2025-05-22 20:26:10.025755	f
9	2	5	Classic T-Shirt	A comfortable cotton t-shirt for everyday wear	\N	19.99	24.99	\N	\N	\N	\N	\N	100	active	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500	\N	\N	2025-05-22 20:28:31.678054	2025-05-22 20:28:31.678054	f
10	2	5	Slim Fit Jeans	Modern slim fit jeans with stretch comfort	\N	39.99	49.99	\N	\N	\N	\N	\N	50	active	https://images.unsplash.com/photo-1542272604-787c3835535d?w=500	\N	\N	2025-05-22 20:28:32.102445	2025-05-22 20:28:32.102445	f
11	2	5	Casual Hoodie	Warm and comfortable hoodie for casual wear	\N	29.99	34.99	\N	\N	\N	\N	\N	75	active	https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500	\N	\N	2025-05-22 20:28:32.474199	2025-05-22 20:28:32.474199	f
12	2	5	Running Shoes	Lightweight running shoes with cushioned soles	\N	59.99	69.99	\N	\N	\N	\N	\N	30	active	https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500	\N	\N	2025-05-22 20:28:32.864275	2025-05-22 20:28:32.864275	f
13	2	5	Leather Wallet	Genuine leather wallet with multiple card slots	\N	24.99	29.99	\N	\N	\N	\N	\N	60	active	https://images.unsplash.com/photo-1627123424574-724758594e93?w=500	\N	\N	2025-05-22 20:28:33.15307	2025-05-22 20:28:33.15307	f
3	1	1	Allen Solly Shirt	Premium cotton formal shirt with comfortable fit and multiple color options	\N	59.99	\N	\N	\N	\N	\N	\N	100	featured	https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3	\N	\N	2025-05-22 19:12:22.185576	2025-05-22 19:12:22.185576	f
14	2	5	Allen Solly Shirt	Premium cotton formal shirt with comfortable fit and multiple color options	\N	59.99	79.99	\N	\N	\N	\N	\N	100	active	https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3	\N	\N	2025-05-27 21:52:07.508046	2025-05-27 21:52:07.508046	f
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, name, description, price, yearly_price, features, product_limit, storage_limit, custom_domain_limit, support_level, trial_days, is_active, is_default, stripe_price_id_monthly, stripe_price_id_yearly, currency, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, type, status, amount, currency, fee, net, vendor_id, invoice_id, order_id, payment_method_id, gateway_transaction_id, gateway_response, refunded_amount, refund_reason, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, first_name, last_name, phone, role, avatar_url, is_profile_complete, created_at) FROM stdin;
1	testvendor@example.com	Test	Vendor	\N	vendor	\N	t	2025-05-22 15:40:59.609431
3	sathvik1702@gmail.com	Sathvik	User	\N	vendor	\N	t	2025-05-22 17:40:27.058722
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, user_id, company_name, description, logo_url, subscription_plan_id, status, store_theme, custom_css, color_palette, font_settings, created_at, subscription_status, trial_ends_at, next_billing_date) FROM stdin;
1	1	Test Store	A test vendor store for development	\N	\N	active	default	\N	default	\N	2025-05-22 15:41:22.485302	trial	\N	\N
2	3	Sathvik Store	My awesome vendor store	\N	\N	active	default	\N	default	\N	2025-05-22 17:40:54.568005	trial	\N	\N
\.


--
-- Name: analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, false);


--
-- Name: customer_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_addresses_id_seq', 1, false);


--
-- Name: customer_payment_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_payment_methods_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: domains_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.domains_id_seq', 1, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: otp_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_codes_id_seq', 15, true);


--
-- Name: payment_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_methods_id_seq', 1, false);


--
-- Name: payment_provider_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_provider_settings_id_seq', 1, false);


--
-- Name: payouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payouts_id_seq', 1, false);


--
-- Name: platform_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platform_subscriptions_id_seq', 1, false);


--
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_categories_id_seq', 5, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 69, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 2, true);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: customer_addresses customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);


--
-- Name: customer_payment_methods customer_payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_payment_methods
    ADD CONSTRAINT customer_payment_methods_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: domains domains_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domains
    ADD CONSTRAINT domains_name_unique UNIQUE (name);


--
-- Name: domains domains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domains
    ADD CONSTRAINT domains_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_unique UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payment_provider_settings payment_provider_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider_settings
    ADD CONSTRAINT payment_provider_settings_pkey PRIMARY KEY (id);


--
-- Name: payouts payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payouts
    ADD CONSTRAINT payouts_pkey PRIMARY KEY (id);


--
-- Name: platform_subscriptions platform_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_subscriptions
    ADD CONSTRAINT platform_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: subscription_plans subscription_plans_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_name_unique UNIQUE (name);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: analytics analytics_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: cart_items cart_items_cart_id_carts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_carts_id_fk FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts carts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: carts carts_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: customer_addresses customer_addresses_customer_id_customers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_customers_id_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_payment_methods customer_payment_methods_customer_id_customers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_payment_methods
    ADD CONSTRAINT customer_payment_methods_customer_id_customers_id_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_payment_methods customer_payment_methods_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_payment_methods
    ADD CONSTRAINT customer_payment_methods_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: customers customers_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: domains domains_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domains
    ADD CONSTRAINT domains_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: invoices invoices_subscription_id_platform_subscriptions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_subscription_id_platform_subscriptions_id_fk FOREIGN KEY (subscription_id) REFERENCES public.platform_subscriptions(id);


--
-- Name: invoices invoices_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_customer_id_customers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_customers_id_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: orders orders_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: payment_methods payment_methods_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: payment_provider_settings payment_provider_settings_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider_settings
    ADD CONSTRAINT payment_provider_settings_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: payouts payouts_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payouts
    ADD CONSTRAINT payouts_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: platform_subscriptions platform_subscriptions_payment_method_id_payment_methods_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_subscriptions
    ADD CONSTRAINT platform_subscriptions_payment_method_id_payment_methods_id_fk FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id);


--
-- Name: platform_subscriptions platform_subscriptions_plan_id_subscription_plans_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_subscriptions
    ADD CONSTRAINT platform_subscriptions_plan_id_subscription_plans_id_fk FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: platform_subscriptions platform_subscriptions_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_subscriptions
    ADD CONSTRAINT platform_subscriptions_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: product_categories product_categories_parent_id_product_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_parent_id_product_categories_id_fk FOREIGN KEY (parent_id) REFERENCES public.product_categories(id);


--
-- Name: product_categories product_categories_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: product_variants product_variants_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_product_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_product_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- Name: products products_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: transactions transactions_invoice_id_invoices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_id_invoices_id_fk FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: transactions transactions_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: transactions transactions_payment_method_id_payment_methods_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_payment_method_id_payment_methods_id_fk FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id);


--
-- Name: transactions transactions_vendor_id_vendors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_vendor_id_vendors_id_fk FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: vendors vendors_subscription_plan_id_subscription_plans_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_subscription_plan_id_subscription_plans_id_fk FOREIGN KEY (subscription_plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: vendors vendors_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

