import { lazy, Suspense } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';

const OfficeScene = lazy(() => import('./office/OfficeScene'));
const OutdoorScene = lazy(() => import('./outdoors/Outdoors'));

export default function Environment() {
  const { environmentSelected } = useHookstateGetters();
  return (
    <Suspense fallback={null}>
      {environmentSelected() === 'Indoor Office' && <OfficeScene />}
      {environmentSelected() === 'Outdoors' && <OutdoorScene />}
    </Suspense>
  );
}
