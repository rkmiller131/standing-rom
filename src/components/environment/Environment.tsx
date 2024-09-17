import { lazy, Suspense, useMemo, memo } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';

const OfficeScene = lazy(() => import('./office/OfficeScene'));
const OutdoorScene = lazy(() => import('./outdoors/Outdoors'));

export default memo(function Environment() {
  const { environmentSelected } = useHookstateGetters();

  const renderScene = useMemo(() => {
    return environmentSelected() === 'Indoor Office' ?
    <OfficeScene /> : <OutdoorScene />
  }, [environmentSelected])

  return (
    <Suspense fallback={null}>
      {renderScene}
    </Suspense>
  );
})
