/**
 * Object Utilities
 * 객체 처리 함수 모음
 */

/**
 * 객체의 모든 값을 매핑합니다
 * @example mapValues({ a: 1, b: 2 }, v => v * 2) => { a: 2, b: 4 }
 */
export const mapValues = <T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R,
): Record<string, R> => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value, key)]));
};

/**
 * 객체의 모든 키를 매핑합니다
 * @example mapKeys({ a: 1, b: 2 }, k => k.toUpperCase()) => { A: 1, B: 2 }
 */
export const mapKeys = <T>(
  obj: Record<string, T>,
  fn: (key: string) => string,
): Record<string, T> => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [fn(key), value]));
};

/**
 * 객체를 필터링합니다
 * @example filterObject({ a: 1, b: 2, c: 3 }, (_, v) => v > 1) => { b: 2, c: 3 }
 */
export const filterObject = <T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean,
): Record<string, T> => {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(value, key)));
};

/**
 * 객체를 병합합니다 (깊은 병합)
 * @example deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) => { a: { b: 1, c: 2 } }
 */
export const deepMerge = <T extends Record<string, any>>(...objects: Partial<T>[]): T => {
  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach((key) => {
      if (
        obj[key] &&
        typeof obj[key] === 'object' &&
        !Array.isArray(obj[key]) &&
        result[key] &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], obj[key]);
      } else {
        result[key] = obj[key];
      }
    });
    return result;
  }, {} as T);
};

/**
 * 객체를 평탄화합니다
 * @example flatten({ a: { b: { c: 1 } } }) => { 'a.b.c': 1 }
 */
export const flatten = (
  obj: Record<string, any>,
  prefix: string = '',
  result: Record<string, any> = {},
): Record<string, any> => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  });

  return result;
};

/**
 * 평탄화된 객체를 다시 중첩된 객체로 변환합니다
 * @example unflatten({ 'a.b.c': 1 }) => { a: { b: { c: 1 } } }
 */
export const unflatten = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = obj[key];
  });

  return result;
};

/**
 * 객체에서 특정 키만 추출합니다
 * @example pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) => { a: 1, c: 3 }
 */
export const pick = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
  return Object.fromEntries(keys.map((key) => [key, obj[key]])) as Partial<T>;
};

/**
 * 객체에서 특정 키를 제외합니다
 * @example omit({ a: 1, b: 2, c: 3 }, ['b']) => { a: 1, c: 3 }
 */
export const omit = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as keyof T)),
  ) as Partial<T>;
};

/**
 * 객체의 키와 값을 바꿉니다
 * @example invert({ a: '1', b: '2' }) => { '1': 'a', '2': 'b' }
 */
export const invert = (obj: Record<string, string>): Record<string, string> => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
};

/**
 * 객체의 값들을 배열로 반환합니다
 * @example values({ a: 1, b: 2 }) => [1, 2]
 */
export const values = <T>(obj: Record<string, T>): T[] => {
  return Object.values(obj);
};

/**
 * 객체의 키들을 배열로 반환합니다
 * @example keys({ a: 1, b: 2 }) => ['a', 'b']
 */
export const keys = <T extends Record<string, any>>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

/**
 * 객체가 비어있는지 확인합니다
 * @example isEmpty({}) => true
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * 객체가 특정 키를 가지고 있는지 확인합니다
 * @example hasKey({ a: 1 }, 'a') => true
 */
export const hasKey = <T extends Record<string, any>>(obj: T, key: keyof T): boolean => {
  return key in obj;
};

/**
 * 객체가 특정 값을 가지고 있는지 확인합니다
 * @example hasValue({ a: 1, b: 2 }, 1) => true
 */
export const hasValue = (obj: Record<string, any>, value: any): boolean => {
  return Object.values(obj).includes(value);
};

/**
 * 객체의 모든 값이 특정 조건을 만족하는지 확인합니다
 * @example every({ a: 2, b: 4 }, v => v > 1) => true
 */
export const every = <T>(obj: Record<string, T>, predicate: (value: T) => boolean): boolean => {
  return Object.values(obj).every(predicate);
};

/**
 * 객체의 값 중 하나라도 특정 조건을 만족하는지 확인합니다
 * @example some({ a: 1, b: 4 }, v => v > 2) => true
 */
export const some = <T>(obj: Record<string, T>, predicate: (value: T) => boolean): boolean => {
  return Object.values(obj).some(predicate);
};

/**
 * 객체를 새로운 객체로 변환합니다
 * @example transform({ a: 1, b: 2 }, (result, value, key) => { result[key] = value * 2; })
 * => { a: 2, b: 4 }
 */
export const transform = <T>(
  obj: Record<string, any>,
  fn: (result: Record<string, T>, value: any, key: string) => void,
): Record<string, T> => {
  const result: Record<string, T> = {};
  Object.entries(obj).forEach(([key, value]) => {
    fn(result, value, key);
  });
  return result;
};

/**
 * 객체를 쿼리 스트링으로 변환합니다
 * @example toQueryString({ name: 'John', age: 30 }) => "name=John&age=30"
 */
export const toQueryString = (obj: Record<string, any>): string => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

/**
 * 쿼리 스트링을 객체로 변환합니다
 * @example fromQueryString("name=John&age=30") => { name: 'John', age: '30' }
 */
export const fromQueryString = (queryString: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const params = new URLSearchParams(queryString);
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * 객체를 깊은 복사합니다
 * @example deepClone({ a: { b: 1 } }) => { a: { b: 1 } } (새 참조)
 */
export const deepClone = <T extends Record<string, any>>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 두 객체가 같은지 깊게 비교합니다
 * @example deepEqual({ a: { b: 1 } }, { a: { b: 1 } }) => true
 */
export const deepEqual = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * 객체에서 null/undefined 값을 제거합니다
 * @example compact({ a: 1, b: null, c: undefined, d: 0 }) => { a: 1, d: 0 }
 */
export const compact = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined),
  ) as Partial<T>;
};

/**
 * 기본값을 적용합니다
 * @example withDefaults({ a: 1 }, { a: 0, b: 2 }) => { a: 1, b: 2 }
 */
export const withDefaults = <T extends Record<string, any>>(obj: Partial<T>, defaults: T): T => {
  return { ...defaults, ...obj };
};
