/**
 * Array/Collection Utilities
 * 배열 및 컬렉션 처리 함수 모음
 */

/**
 * 배열을 고유한 요소만 필터링합니다
 * @example unique([1, 2, 2, 3, 3, 3]) => [1, 2, 3]
 */
export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * 객체 배열에서 특정 속성의 고유 값만 필터링합니다
 * @example uniqueBy([{id: 1, name: 'A'}, {id: 1, name: 'B'}], 'id')
 * => [{id: 1, name: 'A'}]
 */
export const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * 배열을 섞습니다 (Fisher-Yates 알고리즘)
 * @example shuffle([1, 2, 3, 4, 5])
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * 배열에서 마지막 요소를 반환합니다
 * @example last([1, 2, 3]) => 3
 */
export const last = <T>(arr: T[]): T | undefined => {
  return arr[arr.length - 1];
};

/**
 * 배열에서 첫 n개 요소를 반환합니다
 * @example first([1, 2, 3, 4, 5], 3) => [1, 2, 3]
 */
export const first = <T>(arr: T[], n: number = 1): T[] => {
  return arr.slice(0, n);
};

/**
 * 배열을 청크로 나눕니다
 * @example chunk([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/**
 * 배열을 특정 조건에 따라 그룹화합니다
 * @example groupBy([{type: 'a', value: 1}, {type: 'b', value: 2}], 'type')
 * => { a: [{type: 'a', value: 1}], b: [{type: 'b', value: 2}] }
 */
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
};

/**
 * 배열을 평탄화합니다
 * @example flatten([[1, 2], [3, [4, 5]]]) => [1, 2, 3, [4, 5]]
 */
export const flatten = (arr: any[], depth: number = 1): any[] => {
  return arr.reduce((result: any[], item: any) => {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
    return result;
  }, [] as any[]);
};

/**
 * 배열을 완전히 평탄화합니다
 * @example deepFlatten([[1, 2], [3, [4, 5]]]) => [1, 2, 3, 4, 5]
 */
export const deepFlatten = <T>(arr: any[]): T[] => {
  return arr.reduce((result: T[], item: any) => {
    if (Array.isArray(item)) {
      result.push(...deepFlatten<T>(item));
    } else {
      result.push(item as T);
    }
    return result;
  }, [] as T[]);
};

/**
 * 배열의 합계를 구합니다
 * @example sum([1, 2, 3, 4]) => 10
 */
export const sum = (arr: number[]): number => {
  return arr.reduce((total, num) => total + num, 0);
};

/**
 * 배열의 평균을 구합니다
 * @example average([1, 2, 3, 4]) => 2.5
 */
export const average = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
};

/**
 * 배열의 최댓값을 구합니다
 * @example max([1, 5, 3, 2]) => 5
 */
export const max = (arr: number[]): number => {
  return Math.max(...arr);
};

/**
 * 배열의 최솟값을 구합니다
 * @example min([1, 5, 3, 2]) => 1
 */
export const min = (arr: number[]): number => {
  return Math.min(...arr);
};

/**
 * 배열에서 조건을 만족하는 첫 요소의 인덱스를 반환합니다
 * @example findIndex([1, 2, 3, 4], x => x > 2) => 2
 */
export const findIndex = <T>(arr: T[], predicate: (item: T) => boolean): number => {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
};

/**
 * 배열에서 조건을 만족하지 않는 첫 요소의 인덱스를 반환합니다
 * @example findLastIndex([1, 2, 3, 4], x => x < 4) => 2
 */
export const findLastIndex = <T>(arr: T[], predicate: (item: T) => boolean): number => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return i;
  }
  return -1;
};

/**
 * 두 배열의 차집합을 구합니다
 * @example difference([1, 2, 3, 4], [2, 4]) => [1, 3]
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((item) => !arr2.includes(item));
};

/**
 * 두 배열의 교집합을 구합니다
 * @example intersection([1, 2, 3], [2, 3, 4]) => [2, 3]
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((item) => arr2.includes(item));
};

/**
 * 두 배열의 합집합을 구합니다
 * @example union([1, 2, 3], [2, 3, 4]) => [1, 2, 3, 4]
 */
export const union = <T>(arr1: T[], arr2: T[]): T[] => {
  return unique([...arr1, ...arr2]);
};

/**
 * 배열을 오름차순으로 정렬합니다
 * @example sort([3, 1, 4, 1, 5]) => [1, 1, 3, 4, 5]
 */
export const sort = <T extends number | string>(arr: T[]): T[] => {
  return [...arr].sort();
};

/**
 * 배열을 내림차순으로 정렬합니다
 */
export const sortDesc = <T extends number | string>(arr: T[]): T[] => {
  return [...arr].sort().reverse();
};

/**
 * 배열을 특정 속성을 기준으로 정렬합니다
 * @example sortBy([{age: 30}, {age: 20}], 'age') => [{age: 20}, {age: 30}]
 */
export const sortBy = <T>(arr: T[], key: keyof T, desc: boolean = false): T[] => {
  const result = [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return desc ? 1 : -1;
    if (valA > valB) return desc ? -1 : 1;
    return 0;
  });
  return result;
};

/**
 * 배열에서 요소를 제거합니다 (원본 수정 안함)
 * @example remove([1, 2, 3, 2], 2) => [1, 3]
 */
export const remove = <T>(arr: T[], item: T): T[] => {
  return arr.filter((i) => i !== item);
};

/**
 * 배열을 특정 인덱스에 요소를 삽입합니다
 * @example insert([1, 2, 3], 1, 99) => [1, 99, 2, 3]
 */
export const insert = <T>(arr: T[], index: number, item: T): T[] => {
  const result = [...arr];
  result.splice(index, 0, item);
  return result;
};

/**
 * 배열이 비어있는지 확인합니다
 * @example isEmpty([]) => true
 */
export const isEmpty = <T>(arr: T[]): boolean => {
  return arr.length === 0;
};

/**
 * 배열이 비어있지 않은지 확인합니다
 * @example isNotEmpty([1]) => true
 */
export const isNotEmpty = <T>(arr: T[]): boolean => {
  return arr.length > 0;
};

/**
 * 배열의 범위를 확인합니다
 * @example inRange([1, 2, 3], 1) => true
 */
export const inRange = <T>(arr: T[], index: number): boolean => {
  return index >= 0 && index < arr.length;
};

/**
 * 두 배열이 같은지 비교합니다 (순서 무시)
 * @example equalSet([1, 2, 3], [3, 2, 1]) => true
 */
export const equalSet = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return unique(arr1).every((item) => arr2.includes(item));
};

/**
 * 배열을 객체로 변환합니다
 * @example arrayToObject([{key: 'a', value: 1}], 'key')
 * => { a: {key: 'a', value: 1} }
 */
export const arrayToObject = <T extends Record<K, any>, K extends keyof T>(
  arr: T[],
  keyField: K,
): Record<string, T> => {
  return arr.reduce(
    (result, item) => {
      result[String(item[keyField])] = item;
      return result;
    },
    {} as Record<string, T>,
  );
};

/**
 * 배열에서 페이지 데이터를 추출합니다
 * @example paginate([1, 2, 3, 4, 5], 1, 2) => [1, 2]
 */
export const paginate = <T>(arr: T[], page: number, pageSize: number): T[] => {
  const startIndex = (page - 1) * pageSize;
  return arr.slice(startIndex, startIndex + pageSize);
};

/**
 * 배열의 총 페이지 수를 계산합니다
 * @example getTotalPages(10, 3) => 4
 */
export const getTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};
