--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Debian 17.0-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying
);


ALTER TABLE public.accounts OWNER TO admin;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_id_seq OWNER TO admin;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    thumbnail character varying,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL
);


ALTER TABLE public.events OWNER TO admin;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO admin;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: schedule_images; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.schedule_images (
    id integer NOT NULL,
    schedule_item_id integer NOT NULL,
    url character varying NOT NULL,
    text character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.schedule_images OWNER TO admin;

--
-- Name: schedule_images_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.schedule_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_images_id_seq OWNER TO admin;

--
-- Name: schedule_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.schedule_images_id_seq OWNED BY public.schedule_images.id;


--
-- Name: schedule_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.schedule_items (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    event_id integer NOT NULL,
    thumbnail character varying
);


ALTER TABLE public.schedule_items OWNER TO admin;

--
-- Name: schedule_items_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.schedule_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_items_id_seq OWNER TO admin;

--
-- Name: schedule_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.schedule_items_id_seq OWNED BY public.schedule_items.id;


--
-- Name: seaql_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.seaql_migrations (
    version character varying NOT NULL,
    applied_at bigint NOT NULL
);


ALTER TABLE public.seaql_migrations OWNER TO admin;

--
-- Name: vendor_images; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.vendor_images (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    url character varying NOT NULL,
    text character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.vendor_images OWNER TO admin;

--
-- Name: vendor_images_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.vendor_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_images_id_seq OWNER TO admin;

--
-- Name: vendor_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.vendor_images_id_seq OWNED BY public.vendor_images.id;


--
-- Name: vendor_inventory_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.vendor_inventory_items (
    id integer NOT NULL,
    name character varying NOT NULL,
    category character varying NOT NULL,
    vendor_id integer NOT NULL,
    thumbnail character varying,
    event_id integer NOT NULL
);


ALTER TABLE public.vendor_inventory_items OWNER TO admin;

--
-- Name: vendor_inventory_items_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.vendor_inventory_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_inventory_items_id_seq OWNER TO admin;

--
-- Name: vendor_inventory_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.vendor_inventory_items_id_seq OWNED BY public.vendor_inventory_items.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    event_id integer NOT NULL,
    latitude double precision,
    longitude double precision,
    category character varying NOT NULL,
    thumbnail character varying,
    operating_out_of character varying NOT NULL,
    description character varying NOT NULL,
    vendor_type character varying
);


ALTER TABLE public.vendors OWNER TO admin;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO admin;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: schedule_images id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedule_images ALTER COLUMN id SET DEFAULT nextval('public.schedule_images_id_seq'::regclass);


--
-- Name: schedule_items id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedule_items ALTER COLUMN id SET DEFAULT nextval('public.schedule_items_id_seq'::regclass);


--
-- Name: vendor_images id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendor_images ALTER COLUMN id SET DEFAULT nextval('public.vendor_images_id_seq'::regclass);


--
-- Name: vendor_inventory_items id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendor_inventory_items ALTER COLUMN id SET DEFAULT nextval('public.vendor_inventory_items_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: schedule_images schedule_images_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedule_images
    ADD CONSTRAINT schedule_images_pkey PRIMARY KEY (id);


--
-- Name: schedule_items schedule_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT schedule_items_pkey PRIMARY KEY (id);


--
-- Name: seaql_migrations seaql_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.seaql_migrations
    ADD CONSTRAINT seaql_migrations_pkey PRIMARY KEY (version);


--
-- Name: vendor_images vendor_images_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendor_images
    ADD CONSTRAINT vendor_images_pkey PRIMARY KEY (id);


--
-- Name: vendor_inventory_items vendor_inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendor_inventory_items
    ADD CONSTRAINT vendor_inventory_items_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: schedule_items FK_schedule_events; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "FK_schedule_events" FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedule_images FK_schedule_images_schedule_items; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedule_images
    ADD CONSTRAINT "FK_schedule_images_schedule_items" FOREIGN KEY (schedule_item_id) REFERENCES public.schedule_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vendor_images FK_vendor_images_vendor; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendor_images
    ADD CONSTRAINT "FK_vendor_images_vendor" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vendor_inventory_items FK_vendor_inventory_items_vendors; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendor_inventory_items
    ADD CONSTRAINT "FK_vendor_inventory_items_vendors" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vendors FK_vendors_events; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT "FK_vendors_events" FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

