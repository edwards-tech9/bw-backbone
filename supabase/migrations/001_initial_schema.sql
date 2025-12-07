-- BW-Backbone Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. STAFF MANAGEMENT
-- ================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    employee_id TEXT UNIQUE,
    role TEXT[] DEFAULT ARRAY[]::TEXT[],
    department TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    manager_id UUID REFERENCES staff(id),
    photo_url TEXT,
    qr_code TEXT,
    hourly_rate DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_manager ON staff(manager_id);

-- ================================================
-- 2. CUSTOMERS
-- ================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    billing_email TEXT,
    payment_terms TEXT DEFAULT 'net_30',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_company ON customers(company_name);
CREATE INDEX idx_customers_email ON customers(email);

-- ================================================
-- 3. QUOTES
-- ================================================

CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')),
    created_by UUID REFERENCES staff(id),
    ai_generated BOOLEAN DEFAULT FALSE,
    line_items JSONB DEFAULT '[]'::JSONB,
    subtotal DECIMAL(10, 2),
    tax DECIMAL(10, 2),
    total DECIMAL(10, 2),
    lead_time_days INTEGER,
    margin_percent DECIMAL(5, 2),
    notes TEXT,
    expires_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

CREATE INDEX idx_quotes_number ON quotes(quote_number);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);

-- ================================================
-- 4. JOBS
-- ================================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'estimate' CHECK (status IN ('estimate', 'approved', 'in_progress', 'qa', 'complete', 'invoiced')),
    quote_id UUID REFERENCES quotes(id),
    description TEXT,
    priority TEXT DEFAULT 'standard' CHECK (priority IN ('standard', 'rush', 'hold')),
    due_date DATE,
    drive_folder_id TEXT,
    qr_code TEXT,
    total_quoted DECIMAL(10, 2),
    total_actual DECIMAL(10, 2),
    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_number ON jobs(job_number);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_due_date ON jobs(due_date);

-- ================================================
-- 5. COLORS & MATERIALS
-- ================================================

CREATE TABLE colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor TEXT NOT NULL,
    color_code TEXT UNIQUE NOT NULL,
    color_name TEXT,
    finish TEXT CHECK (finish IN ('gloss', 'matte', 'semi-gloss', 'texture')),
    price_per_lb DECIMAL(10, 2),
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'discontinued')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_colors_vendor ON colors(vendor);
CREATE INDEX idx_colors_code ON colors(color_code);

CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_type TEXT NOT NULL,
    vendor TEXT,
    item_code TEXT,
    description TEXT,
    unit_price DECIMAL(10, 2),
    unit TEXT,
    stock_quantity DECIMAL(10, 2),
    reorder_point DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_materials_type ON materials(material_type);

-- ================================================
-- 6. PARTS & OPERATIONS
-- ================================================

CREATE TABLE parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    part_number TEXT,
    part_name TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    material TEXT,
    finish_type TEXT,
    color_id UUID REFERENCES colors(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parts_job ON parts(job_id);

CREATE TABLE operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    operation_type TEXT CHECK (operation_type IN ('sandblast', 'mask', 'powder_coat', 'cure', 'assembly', 'qa')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'paused', 'complete')),
    assigned_to UUID REFERENCES staff(id),
    estimated_minutes INTEGER,
    actual_minutes INTEGER,
    is_high_risk BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT
);

CREATE INDEX idx_operations_part ON operations(part_id);
CREATE INDEX idx_operations_status ON operations(status);
CREATE INDEX idx_operations_assigned ON operations(assigned_to);

CREATE TABLE operation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_id UUID REFERENCES operations(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id),
    action TEXT CHECK (action IN ('start', 'pause', 'resume', 'complete')),
    notes TEXT,
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_operation_logs_operation ON operation_logs(operation_id);

-- ================================================
-- 7. QUALITY CONTROL
-- ================================================

CREATE TABLE defect_taxonomy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_code TEXT UNIQUE NOT NULL,
    defect_name TEXT,
    description TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE qc_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    part_id UUID REFERENCES parts(id),
    operation_id UUID REFERENCES operations(id),
    inspector_id UUID REFERENCES staff(id),
    result TEXT CHECK (result IN ('pass', 'fail', 'conditional')),
    defect_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    severity TEXT CHECK (severity IN ('minor', 'major', 'critical')),
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    corrective_action TEXT,
    notes TEXT,
    inspected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qc_job ON qc_events(job_id);
CREATE INDEX idx_qc_result ON qc_events(result);
CREATE INDEX idx_qc_inspector ON qc_events(inspector_id);

-- ================================================
-- 8. TIME TRACKING & PAYROLL
-- ================================================

CREATE TABLE time_punches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    punch_type TEXT CHECK (punch_type IN ('clock_in', 'clock_out', 'break_start', 'break_end')),
    punch_method TEXT CHECK (punch_method IN ('qr_scan', 'google_auth', 'manual')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    location TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'edited')),
    reviewed_by UUID REFERENCES staff(id),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_punches_staff ON time_punches(staff_id);
CREATE INDEX idx_punches_timestamp ON time_punches(timestamp);
CREATE INDEX idx_punches_status ON time_punches(status);

CREATE TABLE labor_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id),
    operation_id UUID REFERENCES operations(id),
    work_date DATE NOT NULL,
    hours DECIMAL(5, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    burden_multiplier DECIMAL(3, 2) DEFAULT 1.0,
    total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (hours * hourly_rate * burden_multiplier) STORED,
    is_overtime BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES staff(id),
    approved_at TIMESTAMPTZ,
    exported_to_qb BOOLEAN DEFAULT FALSE,
    export_date DATE
);

CREATE INDEX idx_labor_staff ON labor_ledger(staff_id);
CREATE INDEX idx_labor_date ON labor_ledger(work_date);
CREATE INDEX idx_labor_exported ON labor_ledger(exported_to_qb);

CREATE TABLE payroll_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_hours DECIMAL(10, 2),
    total_regular DECIMAL(10, 2),
    total_overtime DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),
    export_file_url TEXT,
    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sent'))
);

-- ================================================
-- 9. EQUIPMENT & MAINTENANCE
-- ================================================

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name TEXT NOT NULL,
    equipment_type TEXT,
    manufacturer TEXT,
    model TEXT,
    serial_number TEXT,
    meter_type TEXT DEFAULT 'none' CHECK (meter_type IN ('hours', 'cycles', 'miles', 'none')),
    current_meter DECIMAL(10, 2),
    service_interval INTEGER,
    next_service_due DECIMAL(10, 2),
    drive_folder_id TEXT,
    qr_code TEXT,
    status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'down', 'maintenance', 'retired')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipment_status ON equipment(status);

CREATE TABLE inspection_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_name TEXT NOT NULL,
    equipment_type TEXT,
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
    checklist_items JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    checklist_id UUID REFERENCES inspection_checklists(id),
    inspector_id UUID REFERENCES staff(id),
    meter_reading DECIMAL(10, 2),
    results JSONB DEFAULT '{}'::JSONB,
    overall_result TEXT CHECK (overall_result IN ('pass', 'fail', 'needs_attention')),
    notes TEXT,
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    pdf_report_url TEXT,
    inspected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspections_equipment ON inspections(equipment_id);

CREATE TABLE maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    task_type TEXT CHECK (task_type IN ('scheduled', 'repair', 'emergency')),
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'complete', 'overdue')),
    assigned_to UUID REFERENCES staff(id),
    completed_by UUID REFERENCES staff(id),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    cost DECIMAL(10, 2)
);

CREATE INDEX idx_maintenance_equipment ON maintenance_tasks(equipment_id);
CREATE INDEX idx_maintenance_status ON maintenance_tasks(status);
CREATE INDEX idx_maintenance_due ON maintenance_tasks(due_date);

-- ================================================
-- 10. INVOICING
-- ================================================

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent', 'paid', 'overdue')),
    line_items JSONB DEFAULT '[]'::JSONB,
    subtotal DECIMAL(10, 2),
    tax DECIMAL(10, 2),
    total DECIMAL(10, 2),
    payment_terms TEXT,
    due_date DATE,
    pdf_url TEXT,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_by UUID REFERENCES staff(id),
    approved_by UUID REFERENCES staff(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_job ON invoices(job_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ================================================
-- 11. MARKETING
-- ================================================

CREATE TABLE marketing_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    post_type TEXT CHECK (post_type IN ('instagram', 'facebook', 'linkedin')),
    caption TEXT,
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    ai_generated BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    engagement_metrics JSONB DEFAULT '{}'::JSONB,
    utm_params JSONB DEFAULT '{}'::JSONB,
    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketing_job ON marketing_posts(job_id);
CREATE INDEX idx_marketing_status ON marketing_posts(status);

CREATE TABLE marketing_attribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES marketing_posts(id),
    inquiry_source TEXT,
    customer_id UUID REFERENCES customers(id),
    quote_id UUID REFERENCES quotes(id),
    converted BOOLEAN DEFAULT FALSE,
    conversion_value DECIMAL(10, 2),
    tracked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 12. PTO REQUESTS
-- ================================================

CREATE TABLE pto_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    request_type TEXT CHECK (request_type IN ('vacation', 'sick', 'personal')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_hours DECIMAL(5, 2),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reviewed_by UUID REFERENCES staff(id),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pto_staff ON pto_requests(staff_id);
CREATE INDEX idx_pto_status ON pto_requests(status);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
