
export interface StampDenomination {
  id: string;
  value: number;
  label: string;
  color: string;
}

export interface SelectedStamp {
  denominationId: string;
  quantity: number;
}

export interface PostageSuggestion {
  category: string;
  weight: string;
  price: number;
  description: string;
  tips: string[];
}
