export enum BetStatus {
  LOST = 'LOST',
  WON = 'WON',
}

export type Bet = {
  createdAt: Date;
  gameID: string;
  sessionID: string;
  roundID: string;
  playerID: string;
  amount: number;
  cashoutCoef?: number;
  balance: number;
  balanceAfter: number;
  status: BetStatus;
};

export type BetResult = Pick<Bet, 'gameID' | 'roundID' | 'sessionID' | 'status'>;
