
import { StampDenomination } from './types';

export const DENOMINATIONS: StampDenomination[] = [
  { id: 'd1', value: 0.1, label: '$0.1', color: 'bg-slate-100' },
  { id: 'd2', value: 0.2, label: '$0.2', color: 'bg-slate-200' },
  { id: 'd3', value: 0.5, label: '$0.5', color: 'bg-amber-100' },
  { id: 'd4', value: 1.0, label: '$1.0', color: 'bg-emerald-100' },
  { id: 'd5', value: 1.7, label: '$1.7', color: 'bg-sky-100' },
  { id: 'd6', value: 2.0, label: '$2.0', color: 'bg-blue-100' },
  { id: 'd7', value: 2.2, label: '$2.2', color: 'bg-indigo-100' },
  { id: 'd8', value: 2.6, label: '$2.6', color: 'bg-violet-100' },
  { id: 'd9', value: 2.8, label: '$2.8', color: 'bg-purple-100' },
  { id: 'd10', value: 3.0, label: '$3.0', color: 'bg-fuchsia-100' },
  { id: 'd11', value: 3.7, label: '$3.7', color: 'bg-pink-100' },
  { id: 'd12', value: 4.0, label: '$4.0', color: 'bg-rose-100' },
  { id: 'd13', value: 4.9, label: '$4.9', color: 'bg-orange-100' },
  { id: 'd14', value: 5.0, label: '$5.0', color: 'bg-red-100' },
  { id: 'd15', value: 10.0, label: '$10', color: 'bg-yellow-200' },
  { id: 'd16', value: 20.0, label: '$20', color: 'bg-lime-200' },
  { id: 'd17', value: 50.0, label: '$50', color: 'bg-cyan-200' },
];

export const POSTAGE_CATEGORIES = [
  "Local Letter (本地信件)",
  "Air Mail (空郵)",
  "Surface Mail (平郵)",
  "Local Packet (本地郵包)",
  "Registered Mail (掛號)"
];
