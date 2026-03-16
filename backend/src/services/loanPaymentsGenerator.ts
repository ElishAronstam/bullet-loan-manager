import  { PaymentEntity, PaymentType } from "../db/entities/Payment";
import type { RateHistory } from "./primeRateScraper";

interface RateSegment {
  days: number;
  rate: number;
}

const lastDayOfMonth = (year: number, month: number): Date =>
  new Date(year, month + 1, 0);

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get the active rate on a given date (most recent entry on or before that date)
const getRateOnDate = (dateStr: string, rateHistory: RateHistory): number => {
  let releventRate = rateHistory.values().next().value!;
  for (const [date, rate] of rateHistory) {
    if (date <= dateStr) {
      releventRate = rate;
    } else {
      break;
    }
  }
  return releventRate;
};

// Splits a month into segments based on rate changes (30/360: each month = 30 days)
const buildRateSegments = (
  monthStart: string,
  monthEnd: string,
  rateHistory: RateHistory,
): RateSegment[] => {
  const segments: RateSegment[] = [];
  let currentRate = getRateOnDate(monthStart, rateHistory);
  let currentDay = 1;

  for (const [date, rate] of rateHistory) {
    if (date <= monthStart || date > monthEnd) continue;
    const changeDay = parseInt(date.slice(8, 10));
    if (changeDay > currentDay) {
      segments.push({ days: changeDay - currentDay, rate: currentRate });
    }
    currentRate = rate;
    currentDay = changeDay;
  }
  segments.push({ days: 30 - (currentDay - 1), rate: currentRate });

  return segments;
};

// Calculates interest from rate segments: principal × Σ(days_i × rate_i / 360)
const sumSegmentInterest = (
  principal: number,
  segments: RateSegment[],
): number => {
  const interest = segments.reduce(
    (sum, seg) => sum + principal * seg.rate * (seg.days / 360),
    0,
  );
  return Math.round(interest * 100) / 100;
};

// Calculate interest for a single month using 30/360 with mid-month rate changes.
const calculateMonthInterest = (
  principal: number,
  year: number,
  month: number,
  rateHistory: RateHistory,
): number => {
  const monthStart = formatDate(new Date(year, month, 1));
  const monthEnd = formatDate(lastDayOfMonth(year, month));

  const segments = buildRateSegments(monthStart, monthEnd, rateHistory);
  return sumSegmentInterest(principal, segments);
};

export const generateLoanPayments = (
  principal: number,
  startDate: string,
  endDate: string,
  rateHistory: RateHistory,
): Omit<PaymentEntity, "id" | "loan">[] => {
  const payments: Omit<PaymentEntity, "id" | "loan">[] = [];
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const balance = principal;

  let paymentDate = lastDayOfMonth(
    startDateObj.getFullYear(),
    startDateObj.getMonth(),
  );

  while (paymentDate < endDateObj) {
    const interest = calculateMonthInterest(
      principal,
      paymentDate.getFullYear(),
      paymentDate.getMonth(),
      rateHistory,
    );

    payments.push({
      paymentDate: formatDate(paymentDate),
      paymentType: PaymentType.Interest,
      principal: 0,
      interest,
      total: interest,
      remainingBalance: balance,
    });

    paymentDate = new Date(
      paymentDate.getFullYear(),
      paymentDate.getMonth() + 2,
      0,
    );
  }

  // Final payment on endDate: principal + interest
  const endDateStr = formatDate(endDateObj);
  const finalInterest = calculateMonthInterest(
    principal,
    endDateObj.getFullYear(),
    endDateObj.getMonth(),
    rateHistory,
  );

  if (
    payments.length > 0 &&
    payments[payments.length - 1].paymentDate === endDateStr
  ) {
    const lastPayment = payments[payments.length - 1];
    lastPayment.paymentType = PaymentType.PrincipalInterest;
    lastPayment.principal = principal;
    lastPayment.total = principal + lastPayment.interest;
    lastPayment.remainingBalance = 0;
  } else {
    payments.push({
      paymentDate: endDateStr,
      paymentType: PaymentType.PrincipalInterest,
      principal,
      interest: finalInterest,
      total: principal + finalInterest,
      remainingBalance: 0,
    });
  }

  return payments;
};
