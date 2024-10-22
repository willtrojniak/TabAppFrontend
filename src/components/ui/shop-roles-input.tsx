import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { shop_roles } from "@/util/shops";
import { isNaN, parseInt } from "lodash";

function getRolesFromBits(val: number) {
  const roles = [];
  for (const key of Object.keys(shop_roles)) {
    if (!isNaN(key) && (val & parseInt(key)) === parseInt(key)) roles.push(key.toString())
  }
  return roles
}

export function ShopRolesInput({ value, onValueChange }: {
  value: number,
  onValueChange: (arg0: number) => void
}) {

  const handleValueChange = React.useCallback((value: string[]) => {
    const val = value.reduce((prev, val) => {
      const bits = parseInt(val)
      return prev | bits
    }, 0)
    onValueChange?.(val)
  }, [onValueChange])

  return <ToggleGroup type="multiple" value={value === 0 ? [] : getRolesFromBits(value)} onValueChange={handleValueChange} className="justify-start">
    <ToggleGroupItem value={shop_roles.ROLE_USER_MANAGE_ITEMS.toString()}>Manage Items</ToggleGroupItem>
    <ToggleGroupItem value={shop_roles.ROLE_USER_MANAGE_TABS.toString()}>Manage Tabs</ToggleGroupItem>
    <ToggleGroupItem value={shop_roles.ROLE_USER_MANAGE_ORDERS.toString()}>Manage Orders</ToggleGroupItem>
    <ToggleGroupItem value={shop_roles.ROLE_USER_READ_TABS.toString()}>View Tabs</ToggleGroupItem>
  </ToggleGroup>
}
