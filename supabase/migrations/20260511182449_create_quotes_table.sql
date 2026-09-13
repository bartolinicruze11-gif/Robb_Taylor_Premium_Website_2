/*
  # Create quotes table

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `name` (text) - full name of requester
      - `company` (text) - optional company/org
      - `email` (text) - contact email
      - `phone` (text) - optional phone
      - `service` (text) - service requested
      - `location` (text) - project location
      - `budget` (text) - budget range
      - `timeline` (text) - desired start date
      - `message` (text) - project description
      - `status` (text) - new | reviewed | quoted | closed
      - `admin_notes` (text) - internal notes
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public can INSERT (submit quotes)
    - No public SELECT (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  timeline text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  admin_notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote"
  ON quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
