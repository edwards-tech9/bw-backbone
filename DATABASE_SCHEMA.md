# BW-Backbone Database Schema

## Overview
PostgreSQL database schema for Biltwood Powder Coating operations management system.

## Core Tables

### 1. Staff Management

#### `staff`
```sql
- id: uuid (PK)
- email: text (unique, not null) -- Gmail for Google OAuth
- first_name: text
- last_name: text
- employee_id: text (unique)
- role: text[] -- array: ['admin', 'manager', 'estimator', 'operator', 'qa', 'billing', 'marketing']
- department: text -- 'production', 'qa', 'office', 'management'
- status: text -- 'active', 'inactive'
- manager_id: uuid (FK -> staff)
- photo_url: text
- qr_code: text -- base64 encoded QR for badge
- hourly_rate: decimal
- created_at: timestamp
- updated_at: timestamp
```

### 2. Job Management

#### `jobs`
```sql
- id: uuid (PK)
- job_number: text (unique, auto-generated or manual)
- customer_id: uuid (FK -> customers)
- status: text -- 'estimate', 'approved', 'in_progress', 'qa', 'complete', 'invoiced'
- quote_id: uuid (FK -> quotes, nullable)
- description: text
- priority: text -- 'standard', 'rush', 'hold'
- due_date: date
- drive_folder_id: text -- Google Drive folder ID
- qr_code: text -- base64 encoded QR for traveler
- total_quoted: decimal
- total_actual: decimal
- created_by: uuid (FK -> staff)
- created_at: timestamp
- updated_at: timestamp
- completed_at: timestamp
```

#### `customers`
```sql
- id: uuid (PK)
- company_name: text (not null)
- contact_name: text
- email: text
- phone: text
- address: text
- city: text
- state: text
- zip: text
- billing_email: text
- payment_terms: text -- 'net_30', 'net_60', 'prepay', etc.
- notes: text
- created_at: timestamp
- updated_at: timestamp
```

#### `parts`
```sql
- id: uuid (PK)
- job_id: uuid (FK -> jobs)
- part_number: text
- part_name: text
- quantity: integer
- material: text
- finish_type: text -- 'powder_coat', 'sandblast', 'assembly'
- color_id: uuid (FK -> colors, nullable)
- notes: text
- created_at: timestamp
```

#### `operations`
```sql
- id: uuid (PK)
- part_id: uuid (FK -> parts)
- sequence: integer
- operation_type: text -- 'sandblast', 'mask', 'powder_coat', 'cure', 'assembly', 'qa'
- status: text -- 'pending', 'in_progress', 'paused', 'complete'
- assigned_to: uuid (FK -> staff, nullable)
- estimated_minutes: integer
- actual_minutes: integer
- is_high_risk: boolean -- requires photo documentation
- started_at: timestamp
- completed_at: timestamp
- notes: text
```

#### `operation_logs`
```sql
- id: uuid (PK)
- operation_id: uuid (FK -> operations)
- staff_id: uuid (FK -> staff)
- action: text -- 'start', 'pause', 'resume', 'complete'
- notes: text
- photo_urls: text[] -- array of Drive URLs
- timestamp: timestamp
```

### 3. Materials & Vendors

#### `colors`
```sql
- id: uuid (PK)
- vendor: text -- 'prismatic', 'tiger', 'sherwin'
- color_code: text (unique)
- color_name: text
- finish: text -- 'gloss', 'matte', 'semi-gloss', 'texture'
- price_per_lb: decimal
- stock_status: text -- 'in_stock', 'low_stock', 'out_of_stock', 'discontinued'
- notes: text
- created_at: timestamp
```

#### `materials`
```sql
- id: uuid (PK)
- material_type: text -- 'media', 'hardware', 'masking', 'chemical'
- vendor: text
- item_code: text
- description: text
- unit_price: decimal
- unit: text -- 'lb', 'ea', 'box', 'gal'
- stock_quantity: decimal
- reorder_point: decimal
- created_at: timestamp
```

### 4. Quality Control

#### `qc_events`
```sql
- id: uuid (PK)
- job_id: uuid (FK -> jobs)
- part_id: uuid (FK -> parts, nullable)
- operation_id: uuid (FK -> operations, nullable)
- inspector_id: uuid (FK -> staff)
- result: text -- 'pass', 'fail', 'conditional'
- defect_types: text[] -- ['orange_peel', 'fisheye', 'contamination', 'overspray', etc.]
- severity: text -- 'minor', 'major', 'critical'
- photo_urls: text[]
- corrective_action: text
- notes: text
- inspected_at: timestamp
```

#### `defect_taxonomy`
```sql
- id: uuid (PK)
- defect_code: text (unique)
- defect_name: text
- description: text
- category: text -- 'surface', 'coverage', 'contamination', 'mechanical'
- created_at: timestamp
```

### 5. Time Tracking & Payroll

#### `time_punches`
```sql
- id: uuid (PK)
- staff_id: uuid (FK -> staff)
- punch_type: text -- 'clock_in', 'clock_out', 'break_start', 'break_end'
- punch_method: text -- 'qr_scan', 'google_auth', 'manual'
- timestamp: timestamp
- location: text -- station/tablet identifier
- notes: text
- status: text -- 'pending', 'approved', 'declined', 'edited'
- reviewed_by: uuid (FK -> staff, nullable)
- reviewed_at: timestamp
```

#### `labor_ledger`
```sql
- id: uuid (PK)
- staff_id: uuid (FK -> staff)
- job_id: uuid (FK -> jobs, nullable)
- operation_id: uuid (FK -> operations, nullable)
- work_date: date
- hours: decimal
- hourly_rate: decimal
- burden_multiplier: decimal -- for overhead calculation
- total_cost: decimal -- (hours × rate × burden)
- is_overtime: boolean
- approved_by: uuid (FK -> staff)
- approved_at: timestamp
- exported_to_qb: boolean
- export_date: date
```

#### `payroll_exports`
```sql
- id: uuid (PK)
- period_start: date
- period_end: date
- total_hours: decimal
- total_regular: decimal
- total_overtime: decimal
- total_cost: decimal
- export_file_url: text -- Drive URL to CSV/IIF
- created_by: uuid (FK -> staff)
- created_at: timestamp
- status: text -- 'pending', 'approved', 'sent'
```

### 6. Estimates & Quotes

#### `quotes`
```sql
- id: uuid (PK)
- quote_number: text (unique, auto-generated)
- customer_id: uuid (FK -> customers)
- status: text -- 'draft', 'sent', 'approved', 'rejected', 'expired'
- created_by: uuid (FK -> staff)
- ai_generated: boolean -- true if JARVIS created it
- line_items: jsonb -- flexible structure for quote details
- subtotal: decimal
- tax: decimal
- total: decimal
- lead_time_days: integer
- margin_percent: decimal
- notes: text
- expires_at: date
- created_at: timestamp
- approved_at: timestamp
```

### 7. Equipment & Maintenance

#### `equipment`
```sql
- id: uuid (PK)
- equipment_name: text
- equipment_type: text -- 'oven', 'booth', 'blaster', 'compressor', 'forklift'
- manufacturer: text
- model: text
- serial_number: text
- meter_type: text -- 'hours', 'cycles', 'miles', 'none'
- current_meter: decimal
- service_interval: integer -- in meter units
- next_service_due: decimal
- drive_folder_id: text
- qr_code: text
- status: text -- 'operational', 'down', 'maintenance', 'retired'
- notes: text
- created_at: timestamp
```

#### `inspection_checklists`
```sql
- id: uuid (PK)
- checklist_name: text
- equipment_type: text
- frequency: text -- 'daily', 'weekly', 'monthly', 'quarterly'
- checklist_items: jsonb -- array of {item: text, type: 'pass_fail' | 'measurement' | 'visual'}
- created_at: timestamp
```

#### `inspections`
```sql
- id: uuid (PK)
- equipment_id: uuid (FK -> equipment)
- checklist_id: uuid (FK -> inspection_checklists)
- inspector_id: uuid (FK -> staff)
- meter_reading: decimal
- results: jsonb -- matches checklist_items structure with responses
- overall_result: text -- 'pass', 'fail', 'needs_attention'
- notes: text
- photo_urls: text[]
- pdf_report_url: text -- auto-generated PDF in Drive
- inspected_at: timestamp
```

#### `maintenance_tasks`
```sql
- id: uuid (PK)
- equipment_id: uuid (FK -> equipment)
- task_type: text -- 'scheduled', 'repair', 'emergency'
- description: text
- due_date: date
- status: text -- 'scheduled', 'in_progress', 'complete', 'overdue'
- assigned_to: uuid (FK -> staff, nullable)
- completed_by: uuid (FK -> staff, nullable)
- completed_at: timestamp
- notes: text
- cost: decimal
```

### 8. Invoicing

#### `invoices`
```sql
- id: uuid (PK)
- invoice_number: text (unique, auto-generated)
- job_id: uuid (FK -> jobs)
- customer_id: uuid (FK -> customers)
- status: text -- 'draft', 'approved', 'sent', 'paid', 'overdue'
- line_items: jsonb
- subtotal: decimal
- tax: decimal
- total: decimal
- payment_terms: text
- due_date: date
- pdf_url: text -- generated PDF in Drive
- sent_at: timestamp
- paid_at: timestamp
- notes: text
- created_by: uuid (FK -> staff)
- approved_by: uuid (FK -> staff, nullable)
- created_at: timestamp
```

### 9. Marketing

#### `marketing_posts`
```sql
- id: uuid (PK)
- job_id: uuid (FK -> jobs)
- post_type: text -- 'instagram', 'facebook', 'linkedin'
- caption: text
- hashtags: text[]
- photo_urls: text[]
- ai_generated: boolean
- status: text -- 'draft', 'scheduled', 'published'
- scheduled_for: timestamp
- published_at: timestamp
- engagement_metrics: jsonb -- {likes, comments, shares, reach}
- utm_params: jsonb -- {source, medium, campaign}
- created_by: uuid (FK -> staff)
- created_at: timestamp
```

#### `marketing_attribution`
```sql
- id: uuid (PK)
- post_id: uuid (FK -> marketing_posts, nullable)
- inquiry_source: text
- customer_id: uuid (FK -> customers, nullable)
- quote_id: uuid (FK -> quotes, nullable)
- converted: boolean
- conversion_value: decimal
- tracked_at: timestamp
```

### 10. PTO & Requests

#### `pto_requests`
```sql
- id: uuid (PK)
- staff_id: uuid (FK -> staff)
- request_type: text -- 'vacation', 'sick', 'personal'
- start_date: date
- end_date: date
- total_hours: decimal
- reason: text
- status: text -- 'pending', 'approved', 'denied'
- reviewed_by: uuid (FK -> staff, nullable) -- assigned manager
- reviewed_at: timestamp
- notes: text
- created_at: timestamp
```

## Row Level Security (RLS) Policies

Each table will have RLS enabled with policies based on staff roles:

- **Admin**: Full access to all tables
- **Manager**: Read/write jobs, parts, operations, staff in their department, time approvals
- **Estimator**: Read/write quotes, customers, materials; read-only jobs
- **Operator**: Read assigned operations, update status, upload photos; punch time
- **QA**: Read/write QC events, inspections; read jobs/parts/operations
- **Billing**: Read/write invoices, customers; read jobs, quotes
- **Marketing**: Read/write marketing posts; read jobs, customers

## Indexes

Key indexes for performance:
- `jobs.job_number`, `jobs.status`, `jobs.customer_id`
- `operations.part_id`, `operations.status`, `operations.assigned_to`
- `time_punches.staff_id`, `time_punches.timestamp`
- `labor_ledger.staff_id`, `labor_ledger.work_date`, `labor_ledger.exported_to_qb`
- `qc_events.job_id`, `qc_events.result`
- `equipment.status`, `maintenance_tasks.status`, `maintenance_tasks.due_date`

## Next Steps

1. Create Supabase project
2. Run migration scripts to create tables
3. Set up RLS policies
4. Create database functions for:
   - Auto-generating job numbers
   - Auto-generating QR codes
   - Calculating labor costs
   - Time punch validation
5. Set up Google Drive API integration
6. Configure Google OAuth
