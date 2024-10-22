import { z } from "zod"
import { categoryOverviewSchema, itemOverviewSchema, substitutionGroupSchema, tabCreateSchema } from "./schemas"

export type User = {
  email: string
  name: string
  preferred_name?: string
  created_at: string
}

export type Auth = {
  logout: () => Promise<void>
  isAuthenticated: boolean
  user?: User
}

export enum PaymentMethod {
  chartstring = "chartstring",
  in_person = "in person"
}

export enum VerificationMethod {
  specify = "specify",
  voucher = "voucher",
  email = "email"
}

export type ShopOverview = {
  id: number
  owner_id: string
  name: string
  payment_methods: PaymentMethod[]
}

export type LocationOverview = {
  id: number,
  name: string,
}

export type Shop = ShopOverview & {
  locations: LocationOverview[]
}

export type ShopUser = User & {
  updated_at: string,
  confirmed: boolean,
  roles: number
}

export type CategoryOverview = z.output<typeof categoryOverviewSchema>

export type Category = {
  id: number,
  index: number,
  shop_id: number,
  name: string,
  items: ItemOverview[],
  item_ids: number[],
}

export type ItemOverview = z.output<typeof itemOverviewSchema>

export type ItemVariant = {
  name: string
  price: number
  id: number
}

export type SubstitutionGroup = z.output<typeof substitutionGroupSchema>

export type Item = ItemOverview & {
  categories: { name: string, id: number }[]
  variants: ItemVariant[]
  addons: ItemOverview[]
  substitution_groups: SubstitutionGroup[]
}

export enum TabStatus {
  pending = "pending",
  confirmed = "confirmed",
  closed = "closed",
}

export enum DayBits {
  Sunday = 1,
  Monday = 1 << 2,
  Tuesday = 1 << 3,
  Wednesday = 1 << 4,
  Thursday = 1 << 5,
  Friday = 1 << 6,
  Saturday = 1 << 7,
}

export const DayOptions = () => [
  { value: DayBits.Sunday, label: "Sun" },
  { value: DayBits.Monday, label: "Mon" },
  { value: DayBits.Tuesday, label: "Tue" },
  { value: DayBits.Wednesday, label: "Wed" },
  { value: DayBits.Thursday, label: "Thu" },
  { value: DayBits.Friday, label: "Fri" },
  { value: DayBits.Saturday, label: "Sat" },
]

type TabBase = Omit<z.output<typeof tabCreateSchema>, "location_ids"> & {
  locations: LocationOverview[]
}

export type TabOverview = TabBase & {
  verification_list: string[],
  pending_updates: TabBase | null,
  is_pending_balance: boolean,
  shop_id: number,
  owner_id: number,
  id: number,
  status: TabStatus,
  locations: LocationOverview[]
}

export type Tab = TabOverview & {
  bills: Bill[]
}

type ItemVariantOrder = ItemVariant & {
  quantity: number
}

type ItemOrder = ItemOverview & {
  quantity: number,
  variants: ItemVariantOrder[]
}

export type Bill = {
  id: number,
  start_date: string,
  end_date: string,
  is_paid: boolean,
  items: ItemOrder[]
}
