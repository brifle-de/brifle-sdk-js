// Type-level assertions, checked by `npm run typecheck` (tsc --noEmit). A
// failing assertion is a compile error at the line that states the rule.

export type Assert<T extends true> = T

type Fn = (...args: any[]) => any

/** the public methods of a class instance type */
type MethodKeys<T> = { [K in keyof T]: T[K] extends Fn ? K : never }[keyof T]

/**
 * true when every method of `Old` still exists on `New` and accepts the
 * arguments it accepted before (new optional parameters are fine).
 */
export type CallsStillCompile<Old, New> = [MethodKeys<Old>] extends [never] ? true : {
    [K in MethodKeys<Old>]: K extends keyof New
        ? Parameters<Extract<Old[K], Fn>> extends Parameters<Extract<New[K], Fn>> ? true : false
        : false
}[MethodKeys<Old>]

/** true when every field of `Old` is still a field of `New` */
export type KeepsFields<Old, New> = [Exclude<keyof Old, keyof New>] extends [never] ? true : false

/** true when `A` is assignable to `B` */
export type Accepts<B, A> = [A] extends [B] ? true : false

type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]

/** true when the public request type can carry every field the API requires */
export type CoversRequired<Public, Wire> = [Exclude<RequiredKeys<Wire>, keyof Public>] extends [never] ? true : false

/** true when every field the public type declares exists in the API's schema */
export type ExistsInSpec<Public, Wire> = [Exclude<keyof Public, keyof Wire>] extends [never] ? true : false

/** shows the offending keys in the error message instead of just `false` */
export type MissingIn<Public, Wire> = Exclude<keyof Public, keyof Wire>
