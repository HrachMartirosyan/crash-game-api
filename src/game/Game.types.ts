type BaseEmit = {
  sessionID: string;
};

type BetEmit = {
  amount: number;
} & BaseEmit;

type CashoutEmit = {
  coef: number;
} & BaseEmit;
