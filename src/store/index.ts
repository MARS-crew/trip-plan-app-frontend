import { create } from 'zustand';

// example of state types
interface AppState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

// create zustand store
export const useAppStore = create<AppState>(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  decrease: () => set(state => ({ count: state.count - 1 })),
}));

// 추가적으로 여러 스토어를 만들고 싶을 때는
// 여기에서 export 해서 사용한다.
