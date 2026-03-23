import { PaymentEntity } from "../../db/entities/Payment";
import { PaymentType } from "../../graphql/generated/types";
import type { RateHistory } from "../rates/primeRateScraper";

const lastDayOfMonth = (year: number, month: number): Date =>
  new Date(year, month + 1, 0);

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const nextMonthEnd = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 2, 0);

interface RateSegment {
  days: number;
  rate: number;
}

const getRateOnDate = (dateStr: string, rateHistory: RateHistory): number => {
  let activeRate = rateHistory.values().next().value!;
  for (const [date, rate] of rateHistory) {
    if (date <= dateStr) {
      activeRate = rate;
    } else {
      break;
    }
  }
  return activeRate;
};

const buildRateSegments = (
  monthStart: string,
  monthEnd: string,
  rateHistory: RateHistory,
  startDay?: number,
  endDay?: number,
): RateSegment[] => {
  const segments: RateSegment[] = [];
  let currentRate = getRateOnDate(monthStart, rateHistory);
  let currentDay = startDay || 1;

  for (const [date, rate] of rateHistory) {
    if (date <= monthStart || date > monthEnd) continue;

    const changeDay = parseInt(date.slice(8, 10));
    if (changeDay > currentDay) {
      segments.push({ days: changeDay - currentDay, rate: currentRate });
    }
    currentRate = rate;
    currentDay = changeDay;
  }

  segments.push({ days: (endDay || 30) - (currentDay - 1), rate: currentRate });
  return segments;
};

const calculateMonthInterest = (
  principal: number,
  year: number,
  month: number,
  rateHistory: RateHistory,
  dayStart?: number,
  endDay?: number,
): number => {
  const monthStart = formatDate(new Date(year, month, dayStart || 1));
  const monthEnd = formatDate(new Date(year, month + 1, endDay || 0));
  const segments = buildRateSegments(
    monthStart,
    monthEnd,
    rateHistory,
    dayStart,
    endDay,
  );

  const interest = segments.reduce(
    (sum, seg) => sum + principal * seg.rate * (seg.days / 360),
    0,
  );
  return Math.round(interest * 100) / 100;
};

type PaymentData = Omit<PaymentEntity, "id" | "loan">;

export const generateLoanPayments = (
  principal: number,
  startDate: string,
  endDate: string,
  rateHistory: RateHistory,
): PaymentData[] => {
  const payments: PaymentData[] = [];
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  let paymentDate = lastDayOfMonth(
    startDateObj.getFullYear(),
    startDateObj.getMonth(),
  );
  console.log("startDate", startDate);
  console.log("first payment date", paymentDate);
  const firstInterest = calculateMonthInterest(
    principal,
    paymentDate.getFullYear(),
    paymentDate.getMonth(),
    rateHistory,
    startDateObj.getDate(),
  );
  console.log("first payment interest", firstInterest);
  payments.push({
    paymentDate: formatDate(paymentDate),
    paymentType: PaymentType.Interest,
    principal: 0,
    interest: firstInterest,
    total: firstInterest,
    remainingBalance: principal,
  });
  paymentDate = nextMonthEnd(paymentDate);

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
      remainingBalance: principal,
    });

    paymentDate = nextMonthEnd(paymentDate);
  }

  const endDateStr = formatDate(endDateObj);
  const finalInterest = calculateMonthInterest(
    principal,
    endDateObj.getFullYear(),
    endDateObj.getMonth(),
    rateHistory,
    undefined,
    endDateObj.getDate(),
  );

  const lastPaymentIsEndDate =
    payments.length > 0 &&
    payments[payments.length - 1].paymentDate === endDateStr;

  if (lastPaymentIsEndDate) {
    const lastPayment = payments[payments.length - 1];
    lastPayment.paymentType = PaymentType.PrincipalAndInterest;
    lastPayment.principal = principal;
    lastPayment.total = principal + lastPayment.interest;
    lastPayment.remainingBalance = 0;
  } else {
    payments.push({
      paymentDate: endDateStr,
      paymentType: PaymentType.PrincipalAndInterest,
      principal,
      interest: finalInterest,
      total: principal + finalInterest,
      remainingBalance: 0,
    });
  }

  return payments;
};
