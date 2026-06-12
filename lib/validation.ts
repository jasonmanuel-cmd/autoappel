import { z } from 'zod'

export const citationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().optional(),
  citationNumber: z.string().min(1, 'Citation number is required').max(50),
  citationDate: z.string().optional(),
  county: z.string().min(1, 'County is required').max(100),
  state: z.string().optional(),
  court: z.string().optional(),
  jurisdiction: z.string().optional(),
  violationType: z.string().min(1, 'Violation type is required').max(200),
  violationCode: z.string().optional(),
  violationDescription: z.string().optional(),
  plea: z.string().optional(),
  responseDeadline: z.string().optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  turnstileToken: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  promo_code: z.string().optional(),
})

export const citationStatusSchema = z.object({
  status: z.enum(['pending', 'in_review', 'accepted', 'rejected', 'flagged', 'expired', 'resolved']),
  notes: z.string().optional(),
})

export const generateStrategySchema = z.object({
  citationId: z.string().min(1, 'citationId is required'),
})

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(255),
  subject: z.string().min(1, 'Subject is required').max(500),
  message: z.string().min(1, 'Message is required').max(5000),
  turnstileToken: z.string().optional(),
})

export const checkoutSchema = z.object({
  plan: z.string().min(1, 'Plan is required').max(100),
  amount: z.number().min(1, 'Amount must be at least 1'),
  citation_id: z.string().optional(),
  promoCode: z.string().optional(),
})

export const validatePromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
  citationId: z.string().optional(),
})

export const notificationEmailSchema = z.object({
  type: z.enum(['welcome', 'verification']),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(100),
  verificationUrl: z.string().url().optional(),
})

export const notificationSMSSchema = z.object({
  type: z.enum(['deadline_alert_48h', 'payment_received', 'submission_decision']),
  phoneNumber: z.string().min(1, 'Phone number is required').max(20),
  citationNumber: z.string().optional(),
  deadline: z.string().optional(),
  amount: z.number().optional(),
  submissionType: z.string().optional(),
  decision: z.enum(['approved', 'denied']).optional(),
})

export const hubspotLeadSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  citationNumber: z.string().optional(),
  county: z.string().optional(),
  state: z.string().optional(),
  violationType: z.string().optional(),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
}).passthrough()

export const paymentProcessSchema = z.object({
  citationId: z.string().min(1, 'citationId is required'),
  amount: z.number().min(1, 'Amount must be at least 1'),
  cardNumber: z.string().min(1, 'Card number is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  cvc: z.string().min(1, 'CVC is required'),
  billingZip: z.string().min(1, 'Billing ZIP is required'),
})
