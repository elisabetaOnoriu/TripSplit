import { useAppSelector } from '../features/store';

export default function useAuthenticated() {
  return useAppSelector(state => state.auth.token !== undefined);
}
