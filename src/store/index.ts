import create from 'zustand';

// 예시 상태 타입
interface AppState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

// zustand 스토어 생성
export const useAppStore = create<AppState>(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  decrease: () => set(state => ({ count: state.count - 1 })),
}));

// 추가적으로 여러 스토어를 만들고 싶을 때는
// 여기에서 export 해서 사용한다.
