export enum shop_roles {
  ROLE_USER_OWNER = 1 << 0,
  ROLE_USER_MANAGE_ITEMS = 1 << 1,
  ROLE_USER_READ_TABS = 1 << 4,
  ROLE_USER_MANAGE_TABS = (1 << 2) | (ROLE_USER_READ_TABS),
  ROLE_USER_MANAGE_ORDERS = (1 << 3) | (ROLE_USER_READ_TABS),
}

export function hasRoles(roles: number, targetRoles: number) {
  return (roles & targetRoles) === targetRoles || (roles & shop_roles.ROLE_USER_OWNER) === shop_roles.ROLE_USER_OWNER
}
