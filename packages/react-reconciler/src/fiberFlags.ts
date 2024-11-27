// packages/react-reconciler/src/fiberFlags.ts
export type Flags = number;

export const NoFlags = 0b0000000;
export const PerformedWork = 0b0000001;
export const Placement = 0b0000010;
export const Update = 0b0000100;
export const ChildDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChildDeletion;

// Fiber 节点本次更新存在副作用
export const PassiveEffect = 0b0010000;
// 执行 useEffect 回调函数的时机：依赖变化时，或函数组件卸载时
export const PassiveMask = PassiveEffect | ChildDeletion;
