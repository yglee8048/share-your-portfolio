export interface CodeLabel {
  code: string;
  label: string;
}

export interface AssetMeta {
  name: string;
  asset_type_code: string;
  asset_type_label: string;
  currency_exposure: boolean;
}

export interface Account {
  id: string;
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
  id: string;
  account_id: string;
  asset_name: string;
  asset_type: CodeLabel;
  currency_exposure: boolean;
  principal_value: number;
  current_value: number | null;
  unrealized_gain: number | null;
  profit_rate: number | null;
}

export interface CreateAccountRequest {
  institution_code: string;
  account_number: string;
  account_type_code: string;
  account_name: string;
}

export interface CreateHoldingRequest {
  name: string;
  asset_type_code: string;
  currency_exposure: boolean;
  principal_value: number;
  current_value?: number;
}
