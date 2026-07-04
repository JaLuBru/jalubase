create extension if not exists pgcrypto;

create table if not exists captures (
  id uuid primary key default gen_random_uuid(),
  title text,
  body text not null,
  capture_type text not null default 'raw_thought',
  domain text not null default 'things_to_remember',
  source text not null default 'manual',
  source_url text,
  tags text[] not null default '{}',
  status text not null default 'inbox',
  resurface_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists captures_status_idx on captures(status);
create index if not exists captures_domain_idx on captures(domain);
create index if not exists captures_resurface_on_idx on captures(resurface_on);
create index if not exists captures_created_at_idx on captures(created_at desc);

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relationship_context text,
  notes text,
  important_dates jsonb not null default '[]'::jsonb,
  last_interaction_on date,
  follow_up_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists people_follow_up_on_idx on people(follow_up_on);

create table if not exists learning_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  learning_type text not null,
  status text not null default 'saved',
  notes text,
  target_on date,
  source text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learning_items_status_idx on learning_items(status);
create index if not exists learning_items_target_on_idx on learning_items(target_on);
