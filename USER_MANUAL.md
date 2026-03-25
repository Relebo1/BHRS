# Botho Health Records System (BHRS)
## User Manual

### Table of Contents
1. Introduction
2. System Requirements
3. Getting Started
4. User Roles and Permissions
5. Features and Functionality
6. Troubleshooting
7. Support

---

## 1. Introduction

The Botho Health Records System (BHRS) is an Electronic Medical Records (EMR) system designed specifically for Botho University Lesotho's clinic. This system replaces traditional paper-based records with a secure, efficient digital platform.

### Purpose
- Streamline patient registration and management
- Digitalize medical records
- Simplify appointment scheduling
- Improve communication between clinic staff and patients
- Enhance data security and accessibility

### Benefits
- **For Students/Staff**: Easy access to medical records, online appointment booking, no need for physical booklets
- **For Clinic Staff**: Efficient patient management, quick record retrieval, reduced paperwork
- **For Administrators**: Better oversight, data analytics, improved resource allocation

---

## 2. System Requirements

### For Users (Students/Staff)
- Web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid Botho University email address

### For Clinic Staff
- Computer with modern web browser
- Stable internet connection
- Login credentials provided by system administrator

---

## 3. Getting Started

### 3.1 Accessing the System
1. Open your web browser
2. Navigate to: `http://bhrs.botho.ac.ls` (or provided URL)
3. You will see the login page

### 3.2 Logging In

**For Administrators:**
- Email: `admin@botho.ac.bw`
- Password: Provided by IT department

**For Doctors:**
- Email: `sekutlu@botho.ac.bw` (or your assigned email)
- Password: Provided by administrator

**For Nurses:**
- Email: Your assigned email
- Password: Provided by administrator

### 3.3 First Time Login
1. Enter your email and password
2. Click "Sign In"
3. You will be redirected to the dashboard
4. Change your password in Settings (recommended)

---

## 4. User Roles and Permissions

### 4.1 Administrator
**Can:**
- Manage all patients
- View all medical records
- Manage all appointments
- Create and manage users (doctors, nurses)
- Access system settings
- View analytics and reports
- Delete records

### 4.2 Doctor
**Can:**
- Register new patients
- View and edit patient information
- Create and update medical records
- Prescribe medication
- Schedule and manage appointments
- View patient history

**Cannot:**
- Create new users
- Delete patients
- Access system settings

### 4.3 Nurse
**Can:**
- Register new patients
- View patient information
- Schedule appointments
- View medical records (read-only)
- Update patient contact information

**Cannot:**
- Create medical records
- Prescribe medication
- Delete records
- Create users

---

## 5. Features and Functionality

### 5.1 Dashboard

**Overview:**
The dashboard provides a quick summary of clinic activities.

**Features:**
- Total patients count
- Today's appointments
- Medical records statistics
- Pending reviews
- Recent patient registrations
- Upcoming appointments list

**How to Use:**
1. After login, you land on the dashboard
2. View statistics in the colored cards at the top
3. Scroll down to see recent patients and appointments
4. Click "View All" to see complete lists

### 5.2 Patient Management

#### 5.2.1 Registering a New Patient

**Steps:**
1. Click "Patients" in the sidebar
2. Click "Add New Patient" button
3. Fill in the patient information form:
   - **Personal Information:**
     - Student ID (required)
     - First Name (required)
     - Last Name (required)
     - Gender (required)
     - Date of Birth (required)
     - Blood Type (optional)
   
   - **Contact Information:**
     - Phone Number (required)
     - Email Address (optional)
     - Physical Address (required)
   
   - **Emergency Contact:**
     - Contact Name (required)
     - Contact Phone (required)
   
   - **Medical Information:**
     - Known Allergies (optional but recommended)

4. Click "Save Patient"
5. Patient is now registered in the system

**Tips:**
- Student ID must be unique
- Double-check phone numbers for accuracy
- Always record known allergies for patient safety
- Emergency contact is crucial for emergencies

#### 5.2.2 Viewing Patient List

**Steps:**
1. Click "Patients" in the sidebar
2. View the list of all registered patients
3. Use the search bar to find specific patients
4. Filter by gender using the dropdown
5. Click on any patient row to view details

**Search Tips:**
- Search by name, student ID, or phone number
- Search is case-insensitive
- Results update as you type

#### 5.2.3 Viewing Patient Profile

**Steps:**
1. From the patients list, click on a patient
2. View complete patient information:
   - Personal details
   - Contact information
   - Medical information
   - Emergency contact
   - Medical history
   - Appointment history

**Actions Available:**
- Edit patient information
- Add medical record
- Schedule appointment
- View full medical history

### 5.3 Medical Records

#### 5.3.1 Adding a Medical Record

**Steps:**
1. Navigate to patient profile
2. Click "Add Record" button
3. Fill in the medical record form:
   - **Diagnosis** (required): Patient's condition
   - **Treatment** (required): Treatment plan
   - **Prescription** (required): Medications prescribed
   - **Visit Date** (required): Date of consultation
   - **Notes** (optional): Additional observations

4. Click "Save Record"

**Best Practices:**
- Be specific in diagnosis
- Include dosage and frequency in prescriptions
- Document all observations in notes
- Review patient allergies before prescribing

#### 5.3.2 Viewing Medical Records

**Steps:**
1. Click "Medical Records" in the sidebar
2. View all medical records
3. Use search to find specific records
4. Click on a record to view full details

**Information Displayed:**
- Visit date
- Patient name and ID
- Diagnosis
- Treatment provided
- Prescription given
- Attending doctor

### 5.4 Appointments

#### 5.4.1 Scheduling an Appointment

**Steps:**
1. Click "Appointments" in the sidebar
2. Click "Schedule Appointment" button
3. Fill in appointment details:
   - **Patient** (required): Select from dropdown
   - **Date** (required): Choose appointment date
   - **Time** (required): Select time slot
   - **Type** (required): Check-up, Follow-up, Consultation, Emergency
   - **Notes** (optional): Special instructions

4. Click "Schedule Appointment"

**Tips:**
- Check doctor availability before scheduling
- Allow 30 minutes between appointments
- Emergency appointments take priority
- Confirm patient contact information

#### 5.4.2 Managing Appointments

**Steps:**
1. View appointments list
2. Filter by status: Scheduled, Completed, Cancelled
3. Click on appointment to view details
4. Update status as needed

**Status Types:**
- **Scheduled**: Appointment is confirmed
- **Completed**: Patient attended and was seen
- **Cancelled**: Appointment was cancelled

#### 5.4.3 Today's Appointments

**Steps:**
1. View dashboard
2. Check "Today's Appointments" section
3. See all appointments scheduled for today
4. Click to view patient details

### 5.5 User Management (Admin Only)

#### 5.5.1 Creating a New User

**Steps:**
1. Click "Users" in the sidebar
2. Click "Add New User" button
3. Fill in user information:
   - **Full Name** (required)
   - **Email Address** (required): Must be unique
   - **Password** (required): Minimum 8 characters
   - **Role** (required): Nurse, Doctor, or Admin

4. Review role permissions
5. Click "Create User"

**Role Selection Guide:**
- **Nurse**: For registration and basic patient management
- **Doctor**: For full clinical access including prescriptions
- **Admin**: For system administration and user management

#### 5.5.2 Managing Existing Users

**Steps:**
1. View users list
2. See user statistics by role
3. Click "Edit" to modify user details
4. Click "Deactivate" to disable user access

**Important:**
- Cannot delete users with existing records
- Deactivated users cannot log in
- Admin accounts should be limited

### 5.6 Search Functionality

**Global Search (Header):**
1. Use search bar in the header
2. Search across patients and records
3. Results appear as you type
4. Click result to navigate

**Page-Specific Search:**
- Each page has its own search
- Filters results on current page only
- Combines with other filters

---

## 6. Troubleshooting

### 6.1 Login Issues

**Problem: Cannot log in**
- **Solution 1**: Verify email and password are correct
- **Solution 2**: Check CAPS LOCK is off
- **Solution 3**: Clear browser cache and cookies
- **Solution 4**: Contact administrator for password reset

**Problem: "Invalid credentials" error**
- **Solution**: Confirm you're using the correct email format
- **Solution**: Request password reset from administrator

### 6.2 Performance Issues

**Problem: System is slow**
- **Solution 1**: Check internet connection
- **Solution 2**: Close unnecessary browser tabs
- **Solution 3**: Clear browser cache
- **Solution 4**: Try a different browser

**Problem: Page not loading**
- **Solution 1**: Refresh the page (F5 or Ctrl+R)
- **Solution 2**: Check internet connection
- **Solution 3**: Clear browser cache
- **Solution 4**: Contact IT support

### 6.3 Data Entry Issues

**Problem: Cannot save patient information**
- **Solution 1**: Check all required fields are filled
- **Solution 2**: Verify Student ID is unique
- **Solution 3**: Check date format is correct
- **Solution 4**: Refresh page and try again

**Problem: "Student ID already exists"**
- **Solution**: This student is already registered
- **Action**: Search for the student instead

### 6.4 Access Issues

**Problem: Cannot access certain features**
- **Solution**: Check your user role permissions
- **Action**: Contact administrator if you need additional access

**Problem: "Unauthorized" error**
- **Solution 1**: Log out and log back in
- **Solution 2**: Your session may have expired
- **Solution 3**: Contact administrator

---

## 7. Support

### 7.1 Getting Help

**For Technical Issues:**
- Email: `itsupport@botho.ac.bw`
- Phone: +266 XXXX XXXX
- Office: IT Department, Main Campus

**For Clinical Questions:**
- Contact: Clinic Administrator
- Email: `clinic@botho.ac.bw`
- Office: University Clinic

**For System Administration:**
- Contact: System Administrator
- Email: `admin@botho.ac.bw`

### 7.2 Reporting Bugs

When reporting issues, include:
1. Your name and role
2. What you were trying to do
3. What happened instead
4. Error message (if any)
5. Screenshot (if possible)
6. Date and time of issue

### 7.3 Feature Requests

To suggest new features:
1. Email: `bhrs-feedback@botho.ac.bw`
2. Include detailed description
3. Explain how it would help
4. Provide examples if possible

### 7.4 Training

**Available Training:**
- Initial user training (2 hours)
- Role-specific training
- Refresher courses
- One-on-one sessions

**To Schedule Training:**
- Contact: Training Coordinator
- Email: `training@botho.ac.bw`
- Book at least 1 week in advance

---

## 8. Best Practices

### 8.1 Data Security

**Do:**
- Log out when leaving your workstation
- Use strong passwords
- Change password regularly
- Keep login credentials confidential
- Lock your computer when away

**Don't:**
- Share your password
- Write down passwords
- Leave system open unattended
- Access system on public computers
- Share patient information unnecessarily

### 8.2 Data Entry

**Do:**
- Double-check all information
- Use proper spelling and grammar
- Be specific in medical notes
- Document all patient interactions
- Save work frequently

**Don't:**
- Use abbreviations without explanation
- Leave required fields empty
- Enter incomplete information
- Copy-paste without verification

### 8.3 Patient Privacy

**Remember:**
- Patient information is confidential
- Only access records you need
- Don't discuss patient information publicly
- Follow HIPAA guidelines
- Report any privacy breaches immediately

---

## 9. Keyboard Shortcuts

- **Ctrl + S**: Save (where applicable)
- **Ctrl + F**: Search on page
- **Esc**: Close modal/dialog
- **Tab**: Navigate between fields
- **Enter**: Submit form (when in text field)

---

## 10. System Updates

The system is regularly updated with:
- Security patches
- Bug fixes
- New features
- Performance improvements

**Update Schedule:**
- Minor updates: Weekly (Sundays, 2:00 AM - 4:00 AM)
- Major updates: Monthly (First Sunday, 2:00 AM - 6:00 AM)

**During Updates:**
- System may be unavailable
- Save all work before scheduled maintenance
- Check email for update notifications

---

## 11. Glossary

- **EMR**: Electronic Medical Records
- **Patient ID**: Unique identifier for each patient
- **Student ID**: University student identification number
- **Dashboard**: Main overview page after login
- **Prescription**: Medication prescribed by doctor
- **Diagnosis**: Medical condition identified
- **Treatment**: Medical care provided
- **Appointment**: Scheduled clinic visit

---

## 12. Appendix

### A. Common Error Messages

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Invalid credentials" | Wrong email/password | Check login details |
| "Unauthorized" | No permission | Contact administrator |
| "Student ID already exists" | Duplicate registration | Search for existing patient |
| "Session expired" | Logged out automatically | Log in again |
| "Network error" | Connection issue | Check internet |

### B. Contact Information

**Botho University Lesotho Clinic**
- Address: Maseru Campus, Lesotho
- Phone: +266 XXXX XXXX
- Email: clinic@botho.ac.bw
- Hours: Monday - Friday, 8:00 AM - 5:00 PM

**IT Support**
- Email: itsupport@botho.ac.bw
- Phone: +266 XXXX XXXX
- Hours: Monday - Friday, 8:00 AM - 5:00 PM

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Prepared by:** BHRS Development Team  
**For:** Botho University Lesotho

---

*This manual is subject to updates. Always refer to the latest version available on the system.*
