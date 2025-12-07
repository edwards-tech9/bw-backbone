// Core types for BW-Backbone

export type StaffRole = 'admin' | 'manager' | 'estimator' | 'operator' | 'qa' | 'billing' | 'marketing';

export type JobStatus = 'estimate' | 'approved' | 'in_progress' | 'qa' | 'complete' | 'invoiced';

export type OperationStatus = 'pending' | 'in_progress' | 'paused' | 'complete';

export type OperationType = 'sandblast' | 'mask' | 'powder_coat' | 'cure' | 'assembly' | 'qa';

export type QCResult = 'pass' | 'fail' | 'conditional';

export interface Staff {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  employee_id: string | null;
  role: StaffRole[];
  department: string | null;
  status: 'active' | 'inactive';
  manager_id: string | null;
  photo_url: string | null;
  qr_code: string | null;
  hourly_rate: number | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  job_number: string;
  customer_id: string;
  status: JobStatus;
  quote_id: string | null;
  description: string | null;
  priority: 'standard' | 'rush' | 'hold';
  due_date: string | null;
  drive_folder_id: string | null;
  qr_code: string | null;
  total_quoted: number | null;
  total_actual: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Customer {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  billing_email: string | null;
  payment_terms: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Part {
  id: string;
  job_id: string;
  part_number: string | null;
  part_name: string | null;
  quantity: number;
  material: string | null;
  finish_type: string;
  color_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface Operation {
  id: string;
  part_id: string;
  sequence: number;
  operation_type: OperationType;
  status: OperationStatus;
  assigned_to: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  is_high_risk: boolean;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
}

export interface TimePunch {
  id: string;
  staff_id: string;
  punch_type: 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
  punch_method: 'qr_scan' | 'google_auth' | 'manual';
  timestamp: string;
  location: string | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'declined' | 'edited';
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface QCEvent {
  id: string;
  job_id: string;
  part_id: string | null;
  operation_id: string | null;
  inspector_id: string;
  result: QCResult;
  defect_types: string[];
  severity: 'minor' | 'major' | 'critical' | null;
  photo_urls: string[];
  corrective_action: string | null;
  notes: string | null;
  inspected_at: string;
}

export interface Equipment {
  id: string;
  equipment_name: string;
  equipment_type: string;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  meter_type: 'hours' | 'cycles' | 'miles' | 'none';
  current_meter: number | null;
  service_interval: number | null;
  next_service_due: number | null;
  drive_folder_id: string | null;
  qr_code: string | null;
  status: 'operational' | 'down' | 'maintenance' | 'retired';
  notes: string | null;
  created_at: string;
}
