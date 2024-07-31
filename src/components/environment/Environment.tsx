import { Suspense } from 'react';
import OutdoorScene from './outdoors/Outdoors';
import OfficeScene from './office/OfficeScene';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';

export default function Environment() {
  const { environmentSelected } = useHookstateGetters();
  return (
    <Suspense fallback={null}>
      {environmentSelected() === 'Indoor Office' && <OfficeScene />}
      {environmentSelected() === 'Outdoors' && <OutdoorScene />}
    </Suspense>
  );
}
