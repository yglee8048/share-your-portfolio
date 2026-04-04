export interface CodeLabel {
  code: string;
  label: string;
}

export interface AssetMeta {
  ticker: string;
  name: string;
  type: CodeLabel;
  currency_exposure: boolean;
}

export interface Account {
  id: number;
  institution: CodeLabel;
  account_number: string;
  account_type: CodeLabel;
  account_name: string;
  holdings_count: number;
  current_value_krw: number;
  principal_krw: number;
  profit_rate: number;
}

export interface Holding {
  id: number;
  account_id: number;
  asset: AssetMeta;
  principal_value: number;
  current_value: number | null;
  unrealized_gain: number | null;
  profit_rate: number | null;
}

export interface CreateAccountRequest {
  institution: string;
  account_number: string;
  account_type: string;
  account_name: string;
}

export interface CreateHoldingRequest {
  asset_ticker: string;
  principal_value: number;
  current_value?: number;
}
