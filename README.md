# Dynamic Form Builder

A React application to build and manage dynamic forms with validation, derived fields, and saved forms.

🔗 **Live Link**: [https://upliance-form-builder-assignment.vercel.app/](https://upliance-form-builder-assignment.vercel.app/)

---

## Features

### Form Builder (`/create`)
- Add fields: Text, Number, Textarea, Select, Radio, Checkbox, Date
- Set:
  - Labels, required fields, default values
  - Validation rules: required, min/max, email, password
  - Options for Select/Radio
- Create derived fields:
  - Age from DOB
  - Sum of numeric fields
  - Custom formulas using field names
- Drag and drop to reorder
- Live preview

### Form Preview (`/preview`)
- View how the form will look and work
- Real-time validation and derived field calculations
- Submit form and see confirmation

### My Forms (`/myforms`)
- List of saved forms with:
  - Created date
  - Number of fields
  - Quick preview/edit access
  - Icons showing required or derived fields

---

## Tech Stack

- React 18 + TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router
- dayjs
- localStorage for persistence

---

## Installation

```bash
npm install
npm start
````

Then go to [http://localhost:3000](http://localhost:3000)

---

## Folder Structure

```
src/
├── components/          // Reusable UI components
├── pages/               // Main routes (Create, Preview, My Forms)
├── store/               // Redux setup
├── types/               // TypeScript types
├── utils/               // Helper functions
├── App.tsx              // Main app
└── index.tsx            // Entry point
```

---

## How to Use

1. Go to **Create Form** page
2. Add and configure fields
3. Add derived fields if needed
4. Save your form
5. Go to **Preview** or **My Forms** to test or view it again

---


