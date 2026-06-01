import { motion } from 'framer-motion';
import Header from './components/Header/Header';
import BranchList from './components/BranchList/BranchList';
import SignalPanel from './components/SignalPanel/SignalPanel';
import Oscilloscope from './components/Oscilloscope/Oscilloscope';
import WanStatus from './components/WanStatus/WanStatus';
import SecurityPanel from './components/SecurityPanel/SecurityPanel';
import SimulationControls from './components/SimulationControls/SimulationControls';
import AlertsLog from './components/AlertsLog/AlertsLog';
import LatencyChart from './components/Charts/LatencyChart';
import TrafficChart from './components/Charts/TrafficChart';
import BandwidthChart from './components/Charts/BandwidthChart';
import TopologyMap from './components/TopologyMap/TopologyMap';
import { useSocket } from './hooks/useSocket';
import { useBranches } from './hooks/useBranches';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  const { connected, signalData, logs, selectBranch: socketSelect, addLog } = useSocket();
  const { branches, allBranches, selectedId, selectBranch, filter, setFilter } = useBranches(socketSelect);
  const { triggerWan, triggerEmi, triggerDdos, triggerLinkCut, restore, isRestoring } = useSimulation(addLog);

  const selectedBranch = allBranches.find(b => b.id === selectedId);

  return (
    <div className="app-layout">
      {/* Sidebar (Left) */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--smat-space-4)' }}>
        <div className="panel" style={{ flexGrow: 1 }}>
          <BranchList branches={branches} selectedId={selectedId} onSelect={selectBranch} filter={filter} onFilterChange={setFilter} />
        </div>
      </aside>

      {/* Main Content (Center) */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: 'var(--smat-space-5)', minWidth: 0 }}>
        <Header connected={connected} signalData={signalData} />
        
        <SignalPanel signalData={signalData} branch={selectedBranch} />
        <Oscilloscope signalData={signalData} />
        <TopologyMap wanLinks={signalData?.wanLinks} ddosActive={signalData?.security?.ddosActive} linkCutActive={signalData?.linkCutActive} />
        
        {/* Gráficos en paralelo para balancear el UI y dar realismo temporal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--smat-space-4)' }}>
          <LatencyChart latencyHistory={signalData?.latencyHistory} />
          <BandwidthChart bandwidthHistory={signalData?.bandwidthHistory} />
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <AlertsLog logs={logs} />
        </div>
      </main>

      {/* Aside (Right) */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--smat-space-4)' }}>
        <div className="panel" style={{ padding: 'var(--smat-space-4)' }}>
          <WanStatus wanLinks={signalData?.wanLinks} />
        </div>
        <div className="panel" style={{ padding: 'var(--smat-space-4)' }}>
          <SecurityPanel security={signalData?.security} linkCutActive={signalData?.linkCutActive} />
        </div>
        <div className="panel" style={{ padding: 'var(--smat-space-4)' }}>
          <SimulationControls 
            onWanFailure={triggerWan} 
            onEmiNoise={triggerEmi} 
            onDdosAttack={triggerDdos} 
            onLinkCut={triggerLinkCut}
            onRestore={restore} 
            isRestoring={isRestoring}
          />
        </div>
        <TrafficChart trafficData={signalData?.trafficDistribution} />
      </aside>
    </div>
  );
}
