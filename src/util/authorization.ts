import { Shop, Tab, TabStatus, User } from "@/types/types";

export enum UserAction {
  UPDATE,
  CREATE_SHOP,
}

const userAuthorizeActionFns: Record<UserAction, (user: User, target: User) => boolean> = {
  [UserAction.UPDATE]: (user: User, target: User) => user.id === target.id,
  [UserAction.CREATE_SHOP]: (user: User, target: User) => user.id === target.id
}

export function authorizeUserAction(user: User, target: User, action: UserAction): boolean {
  return userAuthorizeActionFns[action](user, target)
}

export enum ShopAction {
  READ,
  INVITE_USER,
  REMOVE_USER,
  UPDATE,
  DELETE,
  CREATE_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
  READ_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  READ_ITEMS,
  READ_ITEM,
  CREATE_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  CREATE_VARIANT,
  UPDATE_VARIANT,
  DELETE_VARIANT,
  READ_SUBSTITUTIONS,
  CREATE_SUBSTITUTION,
  UPDATE_SUBSTITUTION,
  DELETE_SUBSTITUTION,
  READ_TABS,
  REQUEST_TAB,
  CREATE_TAB,
}

export enum shopRoles {
  MANAGE_ITEMS = 1 << 0,
  READ_TABS = 1 << 3,
  MANAGE_TABS = 1 << 1 | READ_TABS,
  MANAGE_ORDERS = 1 << 2 | READ_TABS,
  MANAGE_LOCATIONS = 1 << 4,
}

export function hasShopRole(user: User, shop: Shop, role: shopRoles): boolean {
  return user.id === shop.owner_id || shop.users.find(u => u.id === user.id && (u.roles & role) === role) !== undefined
}

const shopAuthorizeActionFns: Record<ShopAction, (user: User, target: Shop) => boolean> = {
  [ShopAction.READ]: (_: User, __: Shop) => true,
  [ShopAction.INVITE_USER]: (user: User, target: Shop) => user.id === target.owner_id,
  [ShopAction.REMOVE_USER]: (user: User, target: Shop) => user.id === target.owner_id,
  [ShopAction.UPDATE]: (user: User, target: Shop) => user.id === target.owner_id,
  [ShopAction.DELETE]: (user: User, target: Shop) => user.id === target.owner_id,
  [ShopAction.CREATE_LOCATION]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_LOCATIONS),
  [ShopAction.UPDATE_LOCATION]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_LOCATIONS),
  [ShopAction.DELETE_LOCATION]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_LOCATIONS),
  [ShopAction.READ_CATEGORIES]: (_: User, __: Shop) => true,
  [ShopAction.CREATE_CATEGORY]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.UPDATE_CATEGORY]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.DELETE_CATEGORY]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.READ_ITEMS]: (_: User, __: Shop) => true,
  [ShopAction.READ_ITEM]: (_: User, __: Shop) => true,
  [ShopAction.CREATE_ITEM]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.UPDATE_ITEM]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.DELETE_ITEM]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.CREATE_VARIANT]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.UPDATE_VARIANT]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.DELETE_VARIANT]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.READ_SUBSTITUTIONS]: (_: User, __: Shop) => true,
  [ShopAction.CREATE_SUBSTITUTION]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.UPDATE_SUBSTITUTION]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.DELETE_SUBSTITUTION]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_ITEMS),
  [ShopAction.READ_TABS]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.READ_TABS),
  [ShopAction.REQUEST_TAB]: (_: User, __: Shop) => true,
  [ShopAction.CREATE_TAB]: (user: User, target: Shop) => hasShopRole(user, target, shopRoles.MANAGE_TABS),
}

export function authorizeShopAction(user: User, target: Shop, action: ShopAction): boolean {
  return shopAuthorizeActionFns[action](user, target)
}

export enum TabAction {
  READ,
  REQUEST_UPDATE,
  UPDATE,
  APPROVE,
  CLOSE,
  CLOSE_BILL,
  ADD_ORDER,
  REMOVE_ORDER,
}

const tabAuthorizeActionFns: Record<TabAction, (user: User, target: { shop: Shop, tab: Tab }) => boolean> = {
  [TabAction.READ]: (user, { shop, tab }) => user.id === tab.owner_id || hasShopRole(user, shop, shopRoles.READ_TABS),
  [TabAction.REQUEST_UPDATE]: (user, { shop, tab }) => user.id === tab.owner_id || hasShopRole(user, shop, shopRoles.MANAGE_TABS),
  [TabAction.UPDATE]: (user, { shop, tab }) => hasShopRole(user, shop, shopRoles.MANAGE_TABS) || (user.id === tab.owner_id && tab.status === TabStatus.pending),
  [TabAction.APPROVE]: (user, { shop }) => hasShopRole(user, shop, shopRoles.MANAGE_TABS),
  [TabAction.CLOSE]: (user, { shop }) => hasShopRole(user, shop, shopRoles.MANAGE_TABS),
  [TabAction.CLOSE_BILL]: (user, { shop }) => hasShopRole(user, shop, shopRoles.MANAGE_TABS),
  [TabAction.ADD_ORDER]: (user, { shop }) => hasShopRole(user, shop, shopRoles.MANAGE_ORDERS),
  [TabAction.REMOVE_ORDER]: (user, { shop }) => hasShopRole(user, shop, shopRoles.MANAGE_ORDERS),
}

export function authorizeTabAction(user: User, target: { shop: Shop, tab: Tab }, action: TabAction): boolean {
  return tabAuthorizeActionFns[action](user, target)
}
