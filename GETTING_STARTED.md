# Getting Started with BW-Backbone

## Welcome! 🎉

You now have a fully functional operations management system built specifically for Biltwood Powder Coating. This guide will help you get up and running.

## What You Can Do Right Now (Demo Mode)

The system is already configured to run in **demo mode** with sample data. You can:

1. **View the Dashboard** - See real-time stats and metrics
2. **Create Jobs** - Add new jobs with auto-generated QR codes
3. **Track Time** - Clock in/out for staff members
4. **Record QC Inspections** - Log quality control events
5. **Manage Staff** - View employee directory
6. **Track Equipment** - Monitor equipment status and maintenance

## Running the Application

### Start the Development Server

```bash
npm run dev
```

Then open your browser to [http://localhost:3000](http://localhost:3000)

### Demo Login

The app starts in demo mode, so you can explore immediately without authentication. The dashboard will load with sample data showing:

- 1 Active Job (in progress)
- 1 Job in QC
- 1 Completed Job ready to invoice
- 2 Staff members clocked in today

## Exploring the System

### 1. Dashboard (`/dashboard`)
Your command center showing:
- Active jobs count
- Jobs pending QC
- Jobs ready to invoice
- Staff currently clocked in
- Quick action buttons

### 2. Job Management (`/jobs`)
View all jobs or create new ones:
- Auto-generated job numbers (e.g., BW2412-0001)
- Customer assignment
- Priority levels (Standard, Rush, Hold)
- Due dates
- Quoted amounts
- QR code generation for travelers

**Try it:** Click "Create New Job" and fill out the form. The system will generate a QR code automatically.

### 3. Time Tracking (`/time`)
Staff clock in/out system:
- Select staff member
- Clock in or clock out
- View recent punches
- See who's currently working
- Manager approval workflow (pending)

**Try it:** Select a staff member and click "Clock In" - it will create a new time punch.

### 4. Quality Control (`/qa`)
Record QC inspections:
- Select job and inspector
- Pass/Fail/Conditional results
- Defect type selection (orange peel, fisheye, etc.)
- Severity levels (Minor, Major, Critical)
- Notes and corrective actions

**Try it:** Click "New Inspection" and record a QC event for one of the sample jobs.

### 5. Staff Management (`/staff`)
Employee directory with:
- Names and employee IDs
- Multiple role support (admin, manager, operator, qa, etc.)
- Department assignments
- Hourly rates
- Active/Inactive status

### 6. Equipment Management (`/equipment`)
Track assets and maintenance:
- Equipment status (Operational, Down, Maintenance)
- Meter readings (hours, cycles, miles)
- Service intervals
- Maintenance scheduling
- Notes and alerts

## Understanding the Mock Data

The demo includes:

### Customers
- **Acme Manufacturing** - Preferred customer with 10% discount
- **BuildRight Construction** - Net 60 payment terms

### Staff
- **Mike Thompson** - Manager/Admin (BW001)
- **Carlos Rodriguez** - Operator (BW002)
- **Lisa Chen** - QA Inspector (BW003)

### Jobs
- **BW2412-0001** - Steel railings, in progress, due Jan 15
- **BW2412-0002** - Window frames, in QC, rush priority
- **BW2411-0087** - Handrails, completed Nov 28

## Next Steps

### Option 1: Keep Using Demo Mode
Perfect for:
- Learning the system
- Training staff
- Creating mockups and presentations
- Testing workflows

### Option 2: Set Up Production Database
When you're ready for real data:

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Choose a secure database password

2. **Run Database Setup**
   - Open Supabase SQL Editor
   - Run the script in `supabase/migrations/001_initial_schema.sql`
   - This creates all tables, indexes, and triggers

3. **Update Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials
   - Set `NEXT_PUBLIC_USE_MOCK_DATA=false`

4. **Add Your First Real Data**
   - Create staff members
   - Add customers
   - Configure equipment
   - Start creating jobs!

See [SETUP.md](SETUP.md) for detailed instructions.

## Key Features Explained

### QR Code System
Every job gets a QR code containing:
- Job ID
- Job Number
- Timestamp

Staff can scan these with tablets on the shop floor to:
- Clock in/out
- Start/complete operations
- Record notes and photos
- Update job status

### Role-Based Access
The system supports multiple roles:
- **Admin** - Full access to everything
- **Manager** - Department-specific access, approvals
- **Estimator** - Quotes, customers, pricing
- **Operator** - Assigned operations, time clock
- **QA** - Quality control, inspections
- **Billing** - Invoices, payments
- **Marketing** - Social media, posts

### Job Lifecycle
Jobs flow through stages:
1. **Estimate** - Initial quote
2. **Approved** - Customer accepted
3. **In Progress** - Active production
4. **QA** - Quality inspection
5. **Complete** - Ready to invoice
6. **Invoiced** - Billed to customer

### Auto-Generated Numbers
The system creates unique IDs for:
- Job numbers (BW2412-0001)
- Quote numbers (QT2412-0001)
- Invoice numbers (INV2412-0001)

Format: `PREFIX + YearMonth + Sequential`

## Common Workflows

### Creating a New Job
1. Dashboard → "Create New Job"
2. Select customer
3. Add description
4. Set priority and due date
5. Enter quoted amount
6. Submit → QR code generated!

### Recording Time
1. Dashboard → "Time Clock"
2. Select staff member
3. Click "Clock In" or "Clock Out"
4. System records timestamp and location
5. Manager reviews and approves later

### QC Inspection
1. Dashboard → "QC Inspection"
2. Click "New Inspection"
3. Select job and inspector
4. Choose result (Pass/Fail/Conditional)
5. Add defects if applicable
6. Record notes
7. Submit

## Customization

You can customize:
- Defect types in QC module
- Equipment types and categories
- Staff roles and permissions
- Job priorities and statuses
- Color catalogs and vendors

Edit the mock data in `src/lib/mockData.ts` to match your needs.

## Documentation

- **README.md** - Project overview and quick start
- **PROJECT_OVERVIEW.md** - Complete feature list and roadmap
- **DATABASE_SCHEMA.md** - Full database documentation
- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Deploy to Vercel guide

## Getting Help

### Application Not Starting?
```bash
# Try reinstalling dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Data Not Showing?
- Check that `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`
- Clear browser cache and reload
- Check browser console for errors

### Build Errors?
```bash
# Run type check
npm run build

# This will show any TypeScript errors
```

## What's Next?

### Phase 2 Features (Coming Soon)
- Google Drive auto-folder creation
- QuickBooks payroll export
- Invoice generation and emailing
- Marketing post automation
- Equipment inspection forms with PDFs

### Phase 3 Features (Future)
- JARVIS AI estimator
- Advanced analytics and reporting
- Mobile PWA for shop floor
- Customer portal
- Supplier integration

## Feedback

As you explore the system, note:
- Features you love
- Things that could be improved
- Missing functionality
- Workflow suggestions

This will help prioritize future development.

---

**Ready to dive in?** Start by exploring the dashboard and trying each module!

Got questions? Check the other documentation files or the inline help throughout the app.

**Happy manufacturing! 🏭**
